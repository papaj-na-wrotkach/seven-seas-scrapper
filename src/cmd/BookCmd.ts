import { CommandModule } from 'yargs'
import { scraper } from '../config'

const BookCmd = {
  command: 'book <bookId> <url>',
  aliases: ['b'],
  describe: 'Scrape metadata for a book',
  builder: yargs => yargs
    .positional('bookId', { describe: 'ID of the book to scrape metadata for' })
    .positional('url', { describe: 'URL of the page to scrape metadata from' }),
  handler: scraper.scrapeBook
} as CommandModule<{}, { bookId: string, url: string }>

export default BookCmd