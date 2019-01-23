import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { makeGetLocale } from './duck';
import LanguageProvider from './view';

const mapStateToProps = createSelector(
  makeGetLocale(),
  locale => ({ locale })
);

export default connect(mapStateToProps)(LanguageProvider);
