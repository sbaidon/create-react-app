/**
 * These should probably be their own package.
 * transifex is a js client.
 * Dependencies: axios, blueimp-md5
 *
 * This file is the middle man between transifex and react-intl
 * Dependencies: glob
 */
import * as fs from 'fs';
import { sync } from 'glob';

import { DEFAULT_LOCALE } from '../../src/store/constants';

const MESSAGES_PATH = '.extractedMessages/';

// Extract default messages. This is probably overkill for this particular task, but
// will be useful when we integrate with transifex.
const defaultMessages = sync(`${MESSAGES_PATH}**/*.json`, {
  ignore: `${MESSAGES_PATH}**/test*/*.json`,
}).map(filename => {
  const name = filename
    .substring(MESSAGES_PATH.length)
    .replace(/\//g, '.')
    .replace('messages.', '');
  const slug = name.replace(/\./g, '-');
  const content = fs.readFileSync(filename, 'utf8');
  const json = JSON.parse(content);

  return {
    file: {
      name,
      slug,
      content: json.reduce((aggr, descriptor) => {
        const { id, defaultMessage } = descriptor;

        if (aggr[id]) {
          throw new Error(`Duplicate message id: ${id}`);
        }

        // eslint-disable-next-line no-param-reassign
        aggr[id] = defaultMessage;

        return aggr;
      }, {}),
    },
    descriptions: {
      name,
      slug,
      content: json.reduce((aggr, descriptor) => {
        const { id, description } = descriptor;

        // eslint-disable-next-line no-param-reassign
        aggr[id] = description;

        return aggr;
      }, {}),
    },
  };
});

// Merging all defaultLocales into one massive json file.
const localeFileContents = defaultMessages.reduce((locales, messages) => {
  // eslint-disable-next-line no-param-reassign
  locales = Object.assign(locales, messages.file.content);
  return locales;
}, {});

// Write file to disk
fs.writeFile(
  `./locales/${DEFAULT_LOCALE}.json`,
  JSON.stringify(localeFileContents),
  'utf8',
  err => {
    if (err) {
      return console.log(err);
    }

    return console.log(`File ${DEFAULT_LOCALE}.json saved!`);
  }
);
