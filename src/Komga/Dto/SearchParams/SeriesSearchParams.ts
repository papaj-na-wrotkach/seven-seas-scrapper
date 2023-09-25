import { ReadStatus, SeriesStatus } from "../all"

export default interface SeriesSearchParams {
  search?: string
  library_id?: string[]
  collection_id?: string[]
  status?: SeriesStatus[]
  read_status?: ReadStatus[]
  publisher?: string[]
  language?: string[]
  genre?: string[]
  tag?: string[]
  age_rating?: string[]
  release_year?: string[]
  sharing_label?: string[]
  deleted?: boolean
  complete?: boolean
  oneshot?: boolean
  unpaged?: boolean
  search_regex?: RegExp
  page?: number
  size?: number
  sort?: string[]
  author?: string[]
}