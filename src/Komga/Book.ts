import Author from "./Author";

export default interface Book {
  title: string,
  authors: Array<Author>
  number: string,
  summary: string,
  publisherUrl: string,
  releaseDate: Date,
  isbn: string,
}
