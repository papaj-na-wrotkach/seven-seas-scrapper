import {
  BookMetadataDto,
  MediaDto,
  ReadProgressDto
} from "."

export default interface BookDto {
    id: string
    seriesId: string
    seriesTitle: string
    libraryId: string
    name: string
    url: string
    number: number
    created: Date
    lastModified: Date
    fileLastModified: Date
    sizeBytes: number
    size: string
    media: MediaDto
    metadata: BookMetadataDto
    readProgress: ReadProgressDto
    deleted: boolean
    fileHash: string
    oneshot: boolean
  }