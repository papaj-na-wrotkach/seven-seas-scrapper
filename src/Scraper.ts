import { FlareSolverrClientOptions } from "./FlareSolverr/FlareSolverrClient"
import {
  BookMetadataDto,
  BookMetadataUpdateDto,
  ReadingDirection,
  SeriesMetadataUpdateDto
} from "./Komga/Dto"
import KomgaClient, { KomgaClientOptions } from "./Komga/KomgaClient"
import SevenSeasClient from "./SevenSeas/SevenSeasClient"

export interface ScraperConfig {
  FlareSolverr: FlareSolverrClientOptions
  Komga: KomgaClientOptions
}

export interface ScrapeOptionsBase {
  url: string
}

export interface ScrapeOptionsSeries extends ScrapeOptionsBase {
  seriesId: string
}

export interface ScrapeOptionsBook extends ScrapeOptionsBase {
  bookId: string
}

export type ScrapeOptionsSeriesBooks = ScrapeOptionsSeries

export default class Scraper {
  sevenSeasClient: SevenSeasClient
  komgaClient: KomgaClient
  
  constructor({ FlareSolverr, Komga }: ScraperConfig) {
    this.komgaClient = new KomgaClient(Komga)
    this.sevenSeasClient = new SevenSeasClient(FlareSolverr)
  }
  
  scrapeSeries = async ({ url, seriesId }: ScrapeOptionsSeries) => {
    const { metadata: current } = await this.komgaClient.getSeries(seriesId)
    const scraped = await this.sevenSeasClient.scrapeSeries(url)
    await this.komgaClient.patchSeriesMetadata(seriesId, {
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
  
  mergeBookMetadata = async (current: BookMetadataDto, url: string) => {
    const scraped = await this.sevenSeasClient.scrapeBook(url)
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
  
  scrapeBook = async ({ url, bookId }: ScrapeOptionsBook) => {
    const { metadata: current } = await this.komgaClient.getBook(bookId)
    await this.komgaClient.patchBookMetadata(bookId, await this.mergeBookMetadata(current, url))
  }
  
  scrapeSeriesBooks = async ({ url, seriesId }: ScrapeOptionsSeriesBooks) => {
    const books = (await this.komgaClient.getSeriesBooks(seriesId, {
      unpaged: true
    })).content.sort(({ metadata: { numberSort: a }}, { metadata: { numberSort: b }}) => a - b)
    const bookLinks = (await this.sevenSeasClient.scrapeSeries(url)).bookLinks
    await this.komgaClient.patchBooksMetadata(Object.fromEntries(await Promise.all(books.map(async (b, i) => [
      b.id,
      await this.mergeBookMetadata(b.metadata, bookLinks[i]!)
    ]))))
  }
}