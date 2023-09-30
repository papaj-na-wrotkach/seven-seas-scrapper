import { MediaStatus } from "."

export default interface MediaDto {
  status: MediaStatus
  mediaType: string
  pagesCount: number
  comment: string
}