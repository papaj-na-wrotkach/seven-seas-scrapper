import { AgeRating, AlternateTitleDto } from "."

export default interface Series {
  title?: string
  alternativeTitles: AlternateTitleDto[]
  summary?: string
  ageRating?: AgeRating
  bookCount?: number
}
