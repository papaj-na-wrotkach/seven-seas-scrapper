import { AuthorDto, WebLinkDto } from "./all"

export default interface BookMetadataUpdateDto {
  title?: string
  titleLock?: boolean
  summaryLock?: boolean
  number?: string
  numberLock?: boolean
  numberSort?: number
  numberSortLock?: boolean
  releaseDateLock?: boolean
  authorsLock?: boolean
  tagsLock?: boolean
  isbnLock?: boolean
  linksLock?: boolean
  tags?: string[]
  releaseDate?: Date
  isbn?: string
  links?: WebLinkDto[]
  authors?: AuthorDto[]
  summary?: string
}