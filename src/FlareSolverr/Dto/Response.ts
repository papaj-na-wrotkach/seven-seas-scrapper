import { FlareSolverrCookie } from "../FlareSolverrClient"

export enum StatusCode {
  ok = "ok",
  warning = "warning",
  error = "error"
}

export interface FlareSolverrResponseBase {
  status: StatusCode
  message: string
  startTimestamp: Date
  endTimestamp: Date
  version: string
}

export interface Solution {
  url: URL
  status: number
  headers?: object //TODO(papaj_na_wrotkach): create type
  response?: string
  cookies: FlareSolverrCookie[]
  userAgent: string
}

export interface RequestResponse extends FlareSolverrResponseBase {
  solution: Solution
}

export interface SessionsListResponse extends FlareSolverrResponseBase {
  sessions: string[]
}

export interface SessionsCreateResponse extends FlareSolverrResponseBase {
  session: string
}