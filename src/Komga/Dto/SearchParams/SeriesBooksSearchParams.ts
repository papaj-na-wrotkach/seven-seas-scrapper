import { MediaStatus, ReadStatus } from ".."

export default interface SeriesBooksSearchParams {
  media_status?: MediaStatus[]
  read_status?: ReadStatus[]
  tag?: string[]
  deleted?: boolean
  unpaged?: boolean
  page?: number
  size?: number
  sort?: string[]
  author?: string[]
}