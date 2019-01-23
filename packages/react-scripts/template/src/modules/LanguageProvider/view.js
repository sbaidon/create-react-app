import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

import { DEFAULT_LOCALE } from 'store/constants';

function LanguageProvider(props) {
  const { children, locale = DEFAULT_LOCALE, messages } = props;

  return (
    <IntlProvider key={locale} locale={locale} messages={messages[locale]}>
      {React.Children.only(children)}
    </IntlProvider>
  );
}

/* eslint-disable react/forbid-prop-types */
LanguageProvider.propTypes = {
  /** Children. */
  children: PropTypes.element.isRequired,
  /** Language to display. */
  locale: PropTypes.string,
  /** Collection of messages. */
  messages: PropTypes.object,
};
/* eslint-enable react/forbid-prop-types */

export default LanguageProvider;
