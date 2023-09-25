import {
  AgeRating,
  AlternateTitleDto,
  ReadingDirection,
  SeriesStatus,
  WebLinkDto
} from "./all"

export default interface SeriesMetadataUpdateDto {
  ageRating?: AgeRating
  ageRatingLock?: boolean
  alternateTitles?: AlternateTitleDto[]
  alternateTitlesLock?: boolean
  genres?: string[]
  genresLock?: boolean
  language?: string
  languageLock?: boolean
  links?: WebLinkDto[]
  linksLock?: boolean
  publisher?: string
  publisherLock?: boolean
  readingDirection?: ReadingDirection
  readingDirectionLock?: boolean
  sharingLabels?: string[]
  sharingLabelsLock?: boolean
  status?: SeriesStatus
  statusLock?: boolean
  summary?: string
  summaryLock?: boolean
  tags?: string[]
  tagsLock?: boolean
  title?: string
  titleLock?: boolean
  titleSort?: string
  titleSortLock?: boolean
  totalBookCount?: number
  totalBookCountLock?: boolean
}