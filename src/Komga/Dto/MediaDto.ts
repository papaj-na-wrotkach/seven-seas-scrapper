import { MediaStatus } from "./all"

export default interface MediaDto {
  status: MediaStatus
  mediaType: string
  pagesCount: number
  comment: string
}