import BookSearchParams from "./Dto/SearchParams/BookSearchParams"
import SeriesBooksSearchParams from "./Dto/SearchParams/SeriesBooksSearchParams"
import SeriesSearchParams from "./Dto/SearchParams/SeriesSearchParams"
import {
  BookDto,
  BookMetadataUpdateDto,
  PageBookDto,
  PageSeriesDto,
  SeriesDto,
  SeriesMetadataUpdateDto
} from "./Dto/all"

export interface KomgaClientOptions {
  url: string
  session?: string
}

export default class KomgaClient {

  private readonly _requestInit: RequestInit = {
    headers: {
      'Content-Type': 'application/json'
    },
  }

  private readonly komgaDateFormat = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })

  readonly baseUrl: URL

  authorized = false

  constructor({ url: baseUrl, session }: KomgaClientOptions) {
    switch (typeof baseUrl) {
      case 'string': this.baseUrl = new URL(baseUrl); break;
      default: this.baseUrl = baseUrl; break;
    }
    session && (this._requestInit.headers = { ...this._requestInit.headers, 'Cookie': session }) && (this.authorized = true)
  }

  fetch = async(path: URL | string, method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" | "HEAD" | "OPTIONS", body?: object) =>
    await fetch(path, {
      ...this._requestInit,
      headers: {
        ...this._requestInit.headers
      },
      method: method ?? "GET",
      body: body ? JSON.stringify(body) : null
    }) as Response

  login = async ({ username, password }: { username: string, password: string }) => {
    const { headers } = await fetch(new URL('/api/v1/login/set-cookie', this.baseUrl), {
      ...this._requestInit,
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      }
    })
    this._requestInit.headers = { ...this._requestInit.headers, 'Cookie': headers.getSetCookie().join('; ') }
    this.authorized = true
  }

  searchSeries = async(params?: SeriesSearchParams) => 
    await (await this.fetch(Object.assign(new URL('/api/v1/series', this.baseUrl), {
      search: new URLSearchParams(params as any) ?? new URLSearchParams()
    }))).json() as PageSeriesDto

  getSeries = async(id: string) => 
    await (await this.fetch(new URL(`/api/v1/series/${id}`, this.baseUrl))).json() as SeriesDto
  

  getSeriesBooks = async(id: string, params?: SeriesBooksSearchParams) => 
    await (await this.fetch(Object.assign(new URL(`/api/v1/series/${id}/books`, this.baseUrl), {
      search: new URLSearchParams(params as any) ?? new URLSearchParams()
    }))).json() as PageBookDto
  

  patchSeriesMetadata = async(id: string, dto?: SeriesMetadataUpdateDto) => {
    await this.fetch(new URL(`/api/v1/series/${id}/metadata`, this.baseUrl), 'PATCH', dto)
  }

  searchBooks = async(params?: BookSearchParams) => 
    await (await this.fetch(Object.assign(new URL('/api/v1/books', this.baseUrl), {
      search: new URLSearchParams(params as any) ?? new URLSearchParams()
    }))).json() as PageBookDto

  getBook = async(id: string) =>
    (await (await this.fetch(new URL(`/api/v1/books/${id}`, this.baseUrl))).json()) as BookDto

  patchBookMetadata = async(id: string, dto?: BookMetadataUpdateDto) => {
    await this.fetch(new URL(`/api/v1/books/${id}/metadata`, this.baseUrl), 'PATCH', {
      ...dto,
      releaseDate: dto?.releaseDate ? this.komgaDateFormat.format(dto.releaseDate) : undefined
    })
  }

  patchBooksMetadata = async(dto: Map<string, BookMetadataUpdateDto>) => {
    await this.fetch(new URL(`/api/v1/books/metadata`, this.baseUrl), 'PATCH', Object.assign({}, ...Object.entries(dto).map(([key, value]) => ({
      [key]: {
        ...value,
        releaseDate: value?.releaseDate ? this.komgaDateFormat.format(value.releaseDate) : undefined
      }
    }))))
  }
}