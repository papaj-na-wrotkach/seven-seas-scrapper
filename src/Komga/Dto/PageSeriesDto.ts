import {
  PageableObject,
  SeriesDto,
  SortObject
} from "."

export default interface PageSeriesDto {
  totalElements: number
  totalPages: number
  size: number
  content: SeriesDto[]
  number: number
  sort: SortObject
  first: boolean
  numberOfElements: number
  pageable: PageableObject
  last: boolean
  empty: boolean
}