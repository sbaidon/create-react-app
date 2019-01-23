import { IntlProvider } from 'react-intl';

import { DEFAULT_LOCALE } from 'store/constants';
import { translationMessages } from 'i18n';

import messages from './messages';

const {
  intl: { formatMessage },
} = new IntlProvider(
  {
    locale: DEFAULT_LOCALE,
    messages: translationMessages,
  },
  {}
).getChildContext();

// eslint-disable-next-line no-restricted-globals
const getNumber = value => (isNaN(value) ? null : parseInt(value, 10));
const getString = value => (typeof value === 'string' ? value : '');

const memoize = fn => {
  const cache = {};

  return (...args) => {
    const key = JSON.stringify(args);

    cache[key] = cache[key] || fn(...args);

    return cache[key];
  };
};

export const required = memoize(() => value =>
  getString(value).trim() ? undefined : formatMessage(messages.requiredError)
);

export const length = memoize((options = {}) => {
  let { min = undefined, max = undefined, exact = undefined } = options;

  min = getNumber(min);
  max = getNumber(max);
  exact = getNumber(exact);

  return value => {
    if (!value) {
      return undefined;
    }

    if (exact !== null && value.length !== exact) {
      return formatMessage(messages.lengthErrorExact, { number: exact });
    }

    if (max !== null && value.length > max) {
      return formatMessage(messages.lengthErrorMax, { number: max });
    }

    if (min !== null && value.length < min) {
      return formatMessage(messages.lengthErrorMin, { number: min });
    }

    return undefined;
  };
});

export const email = memoize(() => value => {
  const regex = /^([^@:\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
  return regex.test(value) ? undefined : formatMessage(messages.emailError);
});

export const makeValidate = validations => values => {
  const errors = {};

  Object.keys(validations).forEach(field => {
    const value = values.get(field);

    errors[field] = validations[field]
      .map(validate => validate(value, values))
      .find(error => error);
  });

  return errors;
};
