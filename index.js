#!/usr/bin/env node

/**
 * Open front page news of popular programming site: HackerNews and Reddit
 */
const request = require('request');
const cheerio = require('cheerio');
const program = require('commander');
const openurl = require('openurl');
const validUrl = require('valid-url');
const ora = require('ora');

const spinner = ora('...').start();
const HN = 'https://news.ycombinator.com/';
const REDDIT = 'https://www.reddit.com/r/programming/';
const CRYPTO = 'https://www.reddit.com/r/cryptocurrency/';

let getNews = link => {
  request(link, (err, response, body) => {
    if (err && response.statusCode != 200) {
      console.log(err);
    }
    if (link.includes('reddit')) {
      parser('a.title', body);
    } else {
      parser('a.storylink', body);
    }
  });
}

let parser = (className, body) => {
  let $ = cheerio.load(body);
  $(className).each((i, e) => {
    if (validUrl.isUri(encodeURI(e.attribs.href))) {
      try {
        openurl.open(e.attribs.href);
      } catch (e) {
        console.log(e);
      }
    }
  });
}

let loading = newsName => {
  setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = `Loading ${newsName} news...Please wait!`;
  }, 200);
}

program
  .version('1.0.0')
  .option('-r, --reddit', 'Open Reddit Programming News')
  .option('-h, --hn', 'Open Hacker News')
  .option('-c, --crypto', 'Open Cryptocurrency reddit home page')
  .parse(process.argv);

if (program.reddit) {
  getNews(REDDIT);
  loading('Reddit');
} else if (program.hn) {
  getNews(HN);
  loading('Hacker');
} else if (program.crypto) {
  getNews(CRYPTO);
  loading('Cryptocurrency');
} else {
  console.log("Invalid command");
  spinner.stop();
}

spinner.stop();

process.on('uncaughtException', function (e) {
  spinner.stop();
  return;
});