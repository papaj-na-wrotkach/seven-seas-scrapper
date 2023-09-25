import { AuthorDto, WebLinkDto } from "./all"

export default interface BookMetadataDto {
  title: string
  titleLock: boolean
  summary: string
  summaryLock: boolean
  number: string
  numberLock: boolean
  numberSort: number
  numberSortLock: boolean
  releaseDate: string
  releaseDateLock: boolean
  authors: AuthorDto[]
  authorsLock: boolean
  tags: string[]
  tagsLock: boolean
  isbn: string
  isbnLock: boolean
  links: WebLinkDto[]
  linksLock: boolean
  created: string
  lastModified: string
}