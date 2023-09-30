import { AuthorDto } from "."

export default interface Book {
  title: string
  summary: string
  number: string
  numberSort: number
  releaseDate: Date
  isbn: string
  authors: AuthorDto[]
}