#!/usr/bin/env node
import Enquirer from 'enquirer'

//@ts-ignore - typescript sees only depedencies and devDependencies inside package.json
import { description, version } from '../package.json'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { scraper } from './config'

scraper.komgaClient.authorized || await scraper.komgaClient.login(await Enquirer.prompt([
  {
    type: 'input',
    name: 'username',
    message: 'Komga username:'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Komga password:'
  }
]) as { username: string, password: string })

yargs(hideBin(process.argv))
  .version(version)
  .usage(description)
  .demandCommand()
  .command((await import('./cmd/SeriesCmd')).default)
  .command((await import('./cmd/BookCmd')).default)
  .command((await import('./cmd/SeriesBooksCmd')).default)
  .parse()
