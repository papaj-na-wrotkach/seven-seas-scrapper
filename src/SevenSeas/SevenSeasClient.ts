import * as cheerio from 'cheerio'
import { ElementType } from 'domelementtype'
import FlareSolverrClient, { FlareSolverrClientOptions } from "../FlareSolverr/FlareSolverrClient"
import {
  AgeRating,
  AlternateTitleDto,
  AuthorDto,
  Book,
  Series
} from "../Komga/Dto/all"

import { RateLimiter } from "limiter-es6-compat"

export type SevenSeasClientOptions = FlareSolverrClientOptions

export default class SevenSeasClient {

  private readonly _flareSolverrClient: FlareSolverrClient

  private readonly _limiter = new RateLimiter({
    tokensPerInterval: 60,
    interval: 'minute'
  })

  constructor(args: SevenSeasClientOptions) {
    this._flareSolverrClient = new FlareSolverrClient(args)
  }

  scrapeSeries = async (url: string) => {
    await this._limiter.removeTokens(20)
    const { solution: { response } } = await this._flareSolverrClient.requestGet({ url: new URL(url) })
    const $ = cheerio.load(response!)
    const seriesBooksLinks = $("div.series-volume > a[href]:has(>img)").map((_, a) => $(a).attr('href')).toArray()
    return {
      title: $('h2.topper').contents().last().text().trim(),
      alternativeTitles: $('div#originaltitle').text().trim().split(' | ').map((title) => ({
        label: /[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}]/gu.test(title) ? 'Native' : 'Romaji',
        title: title
      })) as AlternateTitleDto[],
      summary: $('div.series-description > div.entry > p:not(:empty)')
        .toArray()
        .map(p =>
          $(p.children.filter(e => e.type === ElementType.Text || (e.type === ElementType.Tag && e.tagName.match(/p|br|i/))))
            .text()
            .trim())
        .join('\n\n')
        .trim(),
      ageRating: AgeRating[$('div.age-rating:not(#GS-block)').attr('id') as keyof typeof AgeRating],
      bookCount: seriesBooksLinks.length,
      bookLinks: seriesBooksLinks
    } as Series & { bookLinks: string[] }
  }

  scrapeBook = async (url: string) => {
    await this._limiter.removeTokens(20)
    const { solution: { response: flareSolverrResponse } } = await this._flareSolverrClient.requestGet({ url: new URL(url) })
    const $ = cheerio.load(flareSolverrResponse!)
    const fullTitle = $('h2.topper').contents().last().text().trim()
    const volumeNumberRegex = /(?<title>.*?)\s+(?<volume>Vol. (?<number>[\d\.]+))$/
    return {
      title: fullTitle.replace(volumeNumberRegex, '$<title>'),
      summary: $('div#volume-meta :is(div#iframeContent > p, p.bookcrew ~ p):not(:empty):not(:contains(▪))') //TODO: skip retailers section
        .toArray()
        .map(p =>
          $(p.children.filter(e => e.type === ElementType.Text || (e.type === ElementType.Tag && e.tagName.match(/p|br|i/))))
            .text()
            .trim())
        .join('\n\n')
        .trim(),
      number: fullTitle.replace(volumeNumberRegex, '$<volume>'),
      numberSort: Number(fullTitle.replace(volumeNumberRegex, '$<number>')),
      releaseDate: new Date(($('b:contains(Release Date:)')[0]
        ?.next as { data?: string } & ChildNode | null | undefined)
        ?.data as string, ),
      isbn: (($('b:contains(ISBN:)')[0]
        ?.next as { data?: string } & ChildNode | null | undefined)
        ?.data as string).trim(),
      authors: [
        ...$('p.bookcrew > strong')
          .toArray()
          .flatMap(e => {
            const names = (e.next as { data?: string } & ChildNode | null | undefined)
              ?.data
              ?.trim()
              .split(/(?:,| (?:and|&)) /)
            
            let roles: AuthorDto[] = []

            $(e).text().replace(/:$/g, '').split(/(?:,| (?:and|&)) /).forEach(job => {
              const role = {
                'Translation': 'translator',
                'Lettering': 'letterer',
              }[job]
              role && roles.push(...(names?.map(name => ({ name, role }) as AuthorDto) ?? []))
            })
            return roles
          }),
        ...$('span.creator > a')
          .map((_, e) => $(e).text())
          .toArray()
          .flatMap(name => [
            {
              name,
              role: 'writer'
            },
            {
              name,
              role: 'penciller'
            },
            {
              name,
              role: 'inker'
            },
            {
              name,
              role: 'colorist'
            },
            {
              name,
              role: 'letterer'
            },
            {
              name,
              role: 'cover'
            }
          ] as AuthorDto[])
      ] as AuthorDto[]
    } as Book
  }
}
