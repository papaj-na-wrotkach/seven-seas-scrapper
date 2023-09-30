import SeriesMetadataUpdateDto from "./Dto/SeriesMetadataUpdateDto"

export const DefaultSeriesMetadataUpdateDto = {
  statusLock: false,
  titleLock: true,
  titleSortLock: true,
  summaryLock: true,
  publisher: "Seven Seas",
  publisherLock: true,
  readingDirectionLock: true,
  ageRatingLock: true,
  language: "en",
  languageLock: true,
  totalBookCountLock: false,
  linksLock: false,
  alternateTitlesLock: false,
  readingDirection: "RIGHT_TO_LEFT"
} as SeriesMetadataUpdateDto
