import { connectRouter } from 'connected-react-router/immutable';
import { combineReducers } from 'redux-immutable';
import { Map } from 'immutable';

/* Resources reducers imports */
import app from 'modules/App/duck';
import languageProvider from 'modules/LanguageProvider/duck';

/* Utils */
export const clearReduxForm = state =>
  state
    .set('values', Map({}))
    .set(
      'fields',
      state.get('fields').map(field => field.set('touched', false))
    );

/* UI reducers imports */

/* Entities reducer */
const entities = (state = fromJS({}), action) => {
  switch (action.type) {
    default: {
      if (action.entities) {
        return action.entities.reduce(
          (aggr, value, key) => aggr.mergeIn([key], value),
          state
        );
      }

      return state;
    }
  }
};

/* Resources reducer */
const resources = combineReducers({
  app,
  languageProvider,
});

/* Input reducer */
const form = formReducer.plugin({});

/* Root Reducer */
export default history =>
  combineReducers({
    router: connectRouter(history),
    entities,
    resources,
  });
