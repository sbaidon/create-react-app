import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { DEFAULT_LOCALE, SUCCESS, ERROR, domain } from 'store/constants';

/* Actions */
const languageProvider = domain.defineAction('languageProvider');

export const CHANGE_LANGUAGE = languageProvider.defineAction(
  'CHANGE_LANGUAGE',
  [SUCCESS, ERROR]
);

/* Reducer */
const defaultState = Map({ language: DEFAULT_LOCALE });

const reducer = handleActions(
  {
    [CHANGE_LANGUAGE.SUCCESS]: (state, action) =>
      state.setIn(['language'], action.payload.language),
  },
  defaultState
);

export default reducer;

/* Selectors */
export const getSettings = state =>
  state.getIn(['resources', 'languageProvider'], Map());

export const makeGetLocale = () =>
  createSelector(
    getSettings,
    state => state.get('language')
  );

/* Action Creators */
export const changeLanguage = createAction(CHANGE_LANGUAGE.SUCCESS);
/* Side Effects */
