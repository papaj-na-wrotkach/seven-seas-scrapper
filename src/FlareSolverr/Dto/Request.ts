import { FlareSolverrCookie } from "../FlareSolverrClient"

export interface FlareSolverrDtoBase {
  cmd?: string
}

export interface ProxySettingsDto extends FlareSolverrDtoBase {
  url: URL
  username?: string
  password?: string
}

export interface SessionsCreateDto extends FlareSolverrDtoBase {
  session?: string
  proxy?: ProxySettingsDto
}
  
export interface SessionsDestroyDto extends FlareSolverrDtoBase {
  session: string
}

export interface RequestGetDto extends FlareSolverrDtoBase {
  url: URL
  session?: string
  sessionTtlMinutes?: number
  maxTimeout?: number
  cookies?: FlareSolverrCookie[]
  returnOnlyCookies?: boolean
  proxy?: ProxySettingsDto
}

export interface RequestPostDto extends RequestGetDto {
  postData?: object
}