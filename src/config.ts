import Path from 'node:path'
import { randomUUID } from 'crypto'
import { mkdirSync } from 'fs'
import Paths from 'env-paths'
import Scraper, { ScraperConfig } from './Scraper'

export const appPaths = Paths('seven-seas-scraper', { suffix: '' })
mkdirSync(appPaths.config, { recursive: true })

import nconf from 'nconf'
import yaml from 'js-yaml'
nconf.formats.yaml = {
  parse: str => yaml.load(str, { json: true }),
  stringify: (
    value: any,
    replacer?: ((this: any, key: string, value: any) => any) | undefined,
    space?: number | undefined
  ) => yaml.dump(value, {
    noCompatMode: true,
    indent: space,
    replacer
  })
}
declare module 'nconf' {
  export interface IFormats {
     json: nconf.IFormat
     ini: nconf.IFormat
     yaml: nconf.IFormat
 }
}

const config = nconf
  .env({
    separator: '_',
    whitelist: [
      'FlareSolverr_url',
      'FlareSolverr_session',
      'Komga_url',
      'Komga_session'
    ],
  }).file({
    file: Path.join(appPaths.config, 'config.yaml'),
    format: nconf.formats.yaml,
  }).defaults({
    FlareSolverr: {
      url: 'http://localhost:8191',
      session: randomUUID()
    },
    Komga: {
      url: 'http://localhost:25600',
    }
  }).get() as ScraperConfig

export const scraper = new Scraper(config)
