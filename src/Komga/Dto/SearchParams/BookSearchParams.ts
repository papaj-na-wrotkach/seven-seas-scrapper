import { MediaStatus, ReadStatus } from ".."

export default interface BookSearchParams {
  search?: string
  library_id?: string[]
  media_status?: MediaStatus[]
  read_status?: ReadStatus[]
  released_after?: Date
  tag?: string[]
  unpaged?: boolean
  page?: number
  size?: number
  sort?: string[]
}