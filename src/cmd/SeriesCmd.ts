import { CommandModule } from 'yargs'
import { scraper } from '../config'

const SeriesCmd = {
  command: 'series <seriesId> <url>',
  aliases: ['s'],
  describe: 'Scrape metadata for a series',
  builder: yargs => yargs
    .positional('seriesId', { describe: 'ID of the series to scrape metadata for' })
    .positional('url', { describe: 'URL of the page to scrape metadata from' }),
  handler: scraper.scrapeSeries
} as CommandModule<{}, { seriesId: string, url: string }>

export default SeriesCmd