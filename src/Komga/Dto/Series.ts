import { AgeRating, AlternateTitleDto } from "./all"

export default interface Series {
  title?: string
  alternativeTitles: AlternateTitleDto[]
  summary?: string
  ageRating?: AgeRating
  bookCount?: number
}
