import { AuthorDto } from "./all"

export default interface BookMetadataAggregationDto {
  authors: AuthorDto[]
  tags: string[]
  releaseDate: Date
  summary: string
  summaryNumber: string
  created: Date
  lastModified: Date
}