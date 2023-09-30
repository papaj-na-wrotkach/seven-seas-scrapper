import { CommandModule } from "yargs"
import { scraper } from "../config"

const SeriesBooksCmd = {
  command: 'series-books <seriesId> <url>',
  aliases: [ 'sb', 'books' ],
  describe: 'Scrape metadata for all books in a series',
  builder: yargs => yargs
    .positional('seriesId', { describe: 'ID of the series to scrape metadata for' })
    .positional('url', { describe: 'URL of the page to scrape metadata from' }),
  handler: scraper.scrapeSeriesBooks
} as CommandModule<{}, { seriesId: string, url: string }>

export default SeriesBooksCmd