/**
 * Most of the code taken from react-boilerplate:
 * https://github.com/react-boilerplate/react-boilerplate/blob/master/app/i18n.js
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';

import { DEFAULT_LOCALE } from 'store/constants';

import enTranslationMessages from '../locales/en.json';
import esTranslationMessages from '../locales/es-MX.json';

const messagesMap = {
  en: enTranslationMessages,
  'es-MX': esTranslationMessages,
};

addLocaleData(enLocaleData);
addLocaleData(esLocaleData);

export const appLocales = ['en', 'es-MX'];

export const formatTranslationMessages = (locale, messages) => {
  const defaultMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, messagesMap[DEFAULT_LOCALE])
      : {};

  return Object.keys(messages).reduce((result, key) => {
    const message =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultMessages[key]
        : messages[key];

    return Object.assign(result, { [key]: message });
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  'es-MX': formatTranslationMessages('es-MX', esTranslationMessages),
};
