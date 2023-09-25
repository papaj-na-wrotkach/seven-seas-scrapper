import {
  FlareSolverrDtoBase,
  RequestGetDto,
  RequestPostDto,
  SessionsCreateDto,
  SessionsDestroyDto
} from "./Dto/Request"
import {
  RequestResponse,
  FlareSolverrResponseBase,
  SessionsCreateResponse,
  SessionsListResponse,
  StatusCode
} from "./Dto/Response"

export interface FlareSolverrCookie extends FlareSolverrDtoBase {
  name: string
  value: string
  domain?: string
  path?: string
  expiry?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: string
}

export interface FlareSolverrHeaders {}

export interface FlareSolverrClientOptions {
  url: URL | string
  session: string
}

export default class FlareSolverrClient {
  private readonly _requestInit: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  }
  readonly baseUrl: URL
  session: string

  constructor({ url: baseUrl, session }: FlareSolverrClientOptions) {
    switch (typeof baseUrl) {
      case 'string': this.baseUrl = new URL(baseUrl); break;
      default: this.baseUrl = baseUrl; break;
    }
    this.session = session
  }

  private _sendCmd = async (dto: (FlareSolverrDtoBase)) => {
    const res = await (await fetch(this.baseUrl, {
      ...this._requestInit,
      body: JSON.stringify(dto)
    })).json()

    const { status, message } = res as FlareSolverrResponseBase

    if (status !== StatusCode.ok) throw Error(message)

    return res
  }

  sessionsCreate = async (dto?: SessionsCreateDto) => await this._sendCmd({ ...dto, cmd: "session.create"  }) as SessionsCreateResponse

  sessionsList = async () => await this._sendCmd({ cmd: "sessions.list" }) as SessionsListResponse

  sessionsDestroy = async (dto?: SessionsDestroyDto) => await this._sendCmd({ ...dto, cmd: "sessions.destroy" }) as FlareSolverrResponseBase

  requestGet = async (dto: RequestGetDto) => await this._sendCmd({ session: this.session, ...dto, cmd: "request.get" }) as RequestResponse

  requestPost = async (dto?: RequestPostDto) => await this._sendCmd({ session: this.session, ...dto, cmd: "request.post" }) as RequestResponse
}