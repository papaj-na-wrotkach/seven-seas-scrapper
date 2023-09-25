import { BookMetadataAggregationDto, SeriesMetadataDto } from "./all"

export default interface SeriesDto {
  id: string
  libraryId: string
  name: string
  url: string
  created: Date
  lastModified: Date
  fileLastModified: Date
  booksCount: number
  booksReadCount: number
  booksUnreadCount: number
  booksInProgressCount: number
  metadata: SeriesMetadataDto
  booksMetadata: BookMetadataAggregationDto
  deleted: boolean
  oneshot: boolean
}