import {
  BookDto,
  PageableObject,
  SortObject
} from "./all"

export default interface PageBookDto {
  totalElements: number
  totalPages: number
  size: number
  content: BookDto[]
  number: number
  sort: SortObject
  first: boolean
  numberOfElements: number
  pageable: PageableObject
  last: boolean
  empty: boolean
}