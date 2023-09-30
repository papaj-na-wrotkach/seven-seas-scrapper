#!/usr/bin/env node
import { mkdirSync } from 'fs'
import Path from 'node:path'
import Paths from 'env-paths'
import { randomUUID } from 'crypto'
import Enquirer from 'enquirer'

//@ts-ignore - typescript sees only depedencies and devDependencies inside package.json
import { description, version } from '../package.json'

const appPaths = Paths('seven-seas-scraper', { suffix: '' })
mkdirSync(appPaths.config, { recursive: true })

import nconf from 'nconf'
import yaml from 'js-yaml'
nconf.formats.yaml = {
  parse: str => yaml.load(str, { json: true }),
  stringify: (
    value: any,
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: number | undefined
  ) => yaml.dump(value, {
    noCompatMode: true,
    indent: space,
    replacer
  })
}
declare module 'nconf' {
  export interface IFormats {
     json: nconf.IFormat;
     ini: nconf.IFormat;
     yaml: nconf.IFormat;
 }
}
import yargs, { CommandModule } from 'yargs'
import { hideBin } from 'yargs/helpers'

import { FlareSolverrClientOptions } from './FlareSolverr/FlareSolverrClient'
import {
  BookMetadataDto,
  BookMetadataUpdateDto,
  ReadingDirection,
  SeriesMetadataUpdateDto
} from './Komga/Dto/all'
import KomgaClient, { KomgaClientOptions } from './Komga/KomgaClient'
import SevenSeasClient from './SevenSeas/SevenSeasClient'

export interface ProgramConfig {
  FlareSolverr: FlareSolverrClientOptions
  Komga: KomgaClientOptions
}

interface ProgramArgsBase {
  url: string
}

interface ProgramArgsSeries extends ProgramArgsBase {
  seriesId: string
}

interface ProgramArgsBook extends ProgramArgsBase {
  bookId: string
}

type ProgramArgsSeriesBooks = ProgramArgsSeries

const config = nconf
  .env({ 
    separator: '_',
    whitelist: [
      'FlareSolverr_url',
      'FlareSolverr_session',
      'Komga_url',
      'Komga_session'
    ],
  }).file({
    file: Path.join(appPaths.config, 'config.yaml'),
    format: nconf.formats.yaml,
  }).defaults({
    FlareSolverr: {
      url: 'http://localhost:8191',
      session: randomUUID()
    },
    Komga: {
      url: 'http://localhost:25600',
    }
  }).get() as ProgramConfig

const komgaClient = new KomgaClient(config.Komga)
const sevenSeasClient = new SevenSeasClient(config.FlareSolverr)

komgaClient.authorized || await komgaClient.login(await Enquirer.prompt([
  {
    type: 'input',
    name: 'username',
    message: 'Komga username:'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Komga password:'
  }
]) as { username: string, password: string })

export const scrapeSeries = async ({ url, seriesId }: ProgramArgsSeries) => {
  const { metadata: current } = await komgaClient.getSeries(seriesId)
  const scraped = await sevenSeasClient.scrapeSeries(url)
  await komgaClient.patchSeriesMetadata(seriesId, {
    ...current as SeriesMetadataUpdateDto,
    ageRating: current.ageRatingLock ? current.ageRating : scraped.ageRating,
    ageRatingLock: true,
    alternateTitles: current.alternateTitlesLock ? current.alternateTitles : [
      ...current.alternateTitles,
      ...scraped.alternativeTitles
    ],
    alternateTitlesLock: true,
    language: current.languageLock ? current.language : 'en',
    languageLock: true,
    links: current.linksLock || current.links.find(({ label }) => label === "Seven Seas Entertainment") ?
      current.links :
      [
        {
          label: "Seven Seas Entertainment",
          url: url
        },
        ...current.links,
      ],
    linksLock: true,
    publisher: 'Seven Seas Entertainment',
    publisherLock: true,
    readingDirection: current.readingDirectionLock ? current.readingDirection : ReadingDirection.RigthtToLeft,
    readingDirectionLock: true,
    statusLock: current.status === 'ONGOING' ? false : true,
    summary: current.summaryLock ? current.summary : scraped.summary,
    summaryLock: true,
    title: current.titleLock ? current.title : scraped.title,
    titleLock: true,
    titleSort: current.titleSortLock ? current.titleSort : scraped.title,
    titleSortLock: true,
    totalBookCount: current.totalBookCountLock ? current.totalBookCount : scraped.bookCount,
    totalBookCountLock: current.status === 'ONGOING' ? false : true,
  } as SeriesMetadataUpdateDto)
}

export const mergeBookMetadata = async (current: BookMetadataDto, url: string) => {
  const scraped = await sevenSeasClient.scrapeBook(url)
  return {
    authors: current.authorsLock ? current.authors : scraped.authors,
    authorsLock: true,
    isbn: current.isbnLock ? current.isbn : scraped.isbn,
    isbnLock: true,
    links: current.linksLock || current.links.find(({ label }) => label === "Seven Seas Entertainment") ?
    current.links :
    [
      {
        label: "Seven Seas Entertainment",
        url: url
      },
      ...current.links,
    ],
    linksLock: true,
    number: current.numberLock ? current.number : scraped.number,
    numberLock: true,
    // numberSort: current.numberSortLock ? current.numberSort : scraped.numberSort,
    // numberSortLock: false,
    releaseDate: current.releaseDateLock ? new Date(current.releaseDate) : scraped.releaseDate,
    releaseDateLock: true,
    summary: current.summaryLock ? current.summary : scraped.summary,
    summaryLock: true,
    title: current.titleLock ? current.title : scraped.title,
    titleLock: true,
  } as BookMetadataUpdateDto
}

export const scrapeBook = async ({ url, bookId }: ProgramArgsBook) => {
  const { metadata: current } = await komgaClient.getBook(bookId)
  await komgaClient.patchBookMetadata(bookId, await mergeBookMetadata(current, url))
}

export const scrapeSeriesBooks = async ({ url, seriesId }: ProgramArgsSeriesBooks) => {
  const books = (await komgaClient.getSeriesBooks(seriesId, {
    unpaged: true
  })).content.sort(({ metadata: { numberSort: a }}, { metadata: { numberSort: b }}) => a - b)
  const bookLinks = (await sevenSeasClient.scrapeSeries(url)).bookLinks
  await komgaClient.patchBooksMetadata(Object.fromEntries(await Promise.all(books.map(async (b, i) => [
    b.id,
    await mergeBookMetadata(b.metadata, bookLinks[i]!)
  ]))))
}

yargs(hideBin(process.argv))
  .version(version)
  .usage(description)
  .demandCommand()
  .command({
    command: 'series <seriesId> <url>',
    aliases: ['s'],
    describe: 'Scrape metadata for a series',
    builder: yargs => yargs
      .positional('seriesId', { describe: 'ID of the series to scrape metadata for' })
      .positional('url', { describe: 'URL of the page to scrape metadata from' }),
    handler: scrapeSeries
  } as CommandModule<{}, { seriesId: string, url: string }>)
  .command({
    command: 'book <bookId> <url>',
    aliases: ['b'],
    describe: 'Scrape metadata for a book',
    builder: yargs => yargs
      .positional('bookId', { describe: 'ID of the book to scrape metadata for' })
      .positional('url', { describe: 'URL of the page to scrape metadata from' }),
    handler: scrapeBook
  } as CommandModule<{}, { bookId: string, url: string }>)
  .command({
    command: 'series-books <seriesId> <url>',
    aliases: [ 'sb', 'books' ],
    describe: 'Scrape metadata for all books in a series',
    builder: yargs => yargs
      .positional('seriesId', { describe: 'ID of the series to scrape metadata for' })
      .positional('url', { describe: 'URL of the page to scrape metadata from' }),
    handler: scrapeSeriesBooks
  } as CommandModule<{}, { seriesId: string, url: string }>)
  .parse()
