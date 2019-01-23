import { all } from 'redux-saga/effects';
import { appWatchers } from '../modules/App/duck';

/* eslint-disable */
export default function* rootSaga() {
  yield all([...appWatchers]);
}
/* eslint-enable */
