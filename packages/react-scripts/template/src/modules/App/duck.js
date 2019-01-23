import { createAction, handleActions } from 'redux-actions';
import {
  fork,
  take,
  takeEvery,
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { fromJS, Map } from 'immutable';
import { ServerError } from '@wepow/hermes';

import { domain, PENDING, SUCCESS, ERROR } from 'store/constants';
import { setupClient, resolve } from 'utils/api';
import selectResource from 'utils/selectors';

/* Actions */
const namespace = domain.defineAction('root');

export const LOAD_APP = namespace.defineAction('LOAD_APP', [SUCCESS, ERROR]);

export const ROOT_API_REQUEST = namespace.defineAction('ROOT_API_REQUEST', [
  PENDING,
  SUCCESS,
  ERROR,
]);

export const API_REQUEST = namespace.defineAction('API_REQUEST', [
  PENDING,
  SUCCESS,
  ERROR,
]);

/* Reducer */
const defaultState = fromJS({
  isReady: false,
  rootApiRequest: {
    error: undefined,
    hasCompleted: false,
    hasFailed: false,
    isPending: true,
    statusCode: undefined,
  },
  apiRequest: {
    error: undefined,
    hasCompleted: false,
    hasFailed: false,
    isPending: false,
    statusCode: undefined,
  },
});

const reducer = handleActions(
  {
    [ROOT_API_REQUEST.SUCCESS]: (state, { payload }) =>
      state
        .set('wepow:root', payload)
        .setIn(['rootApiRequest', 'hasCompleted'], true)
        .setIn(['rootApiRequest', 'isPending'], false),

    [ROOT_API_REQUEST.ERROR]: (state, { payload }) =>
      state
        .setIn(['rootApiRequest', 'isPending'], false)
        .setIn(['rootApiRequest', 'hasFailed'], true)
        .setIn(['rootApiRequest', 'statusCode'], payload.statusCode)
        .setIn(['rootApiRequest', 'error'], payload.error),

    [API_REQUEST.PENDING]: state =>
      state.setIn(['apiRequest', 'isPending'], true),

    [API_REQUEST.SUCCESS]: state =>
      state
        .setIn(['apiRequest', 'isPending'], false)
        .setIn(['apiRequest', 'hasCompleted'], true),

    [API_REQUEST.ERROR]: (state, { payload }) =>
      state
        .setIn(['apiRequest', 'isPending'], false)
        .setIn(['apiRequest', 'hasFailed'], true)
        .setIn(['apiRequest', 'statusCode'], payload.statusCode)
        .setIn(['apiRequest', 'error'], payload.error),

    [LOAD_APP.SUCCESS]: state => state.set('isReady', true),
  },
  defaultState
);

/* Selectors */
export const selectRoot = selectResource(['app', 'wepow:root'], Map());

export const selectAppAttribute = attribute => state =>
  state.getIn(['resources', 'app', attribute]);

/* Action Creators */
export const loadApp = createAction(LOAD_APP.ACTION);
export const getRootApi = createAction(ROOT_API_REQUEST.ACTION);

const emptyAction = { payload: { payload: null, type: null } };
/* Side Effects */
export function* apiCallSaga({ payload: { type, payload } } = emptyAction) {
  try {
    if (!type) return;

    const response = yield call(resolve, { ...payload });
    let result = { type: `${type}_${SUCCESS}` };
    if (response) {
      result = {
        ...result,
        payload: fromJS(response.result),
        entities: fromJS(response.entities),
      };
    }
    yield put({ type: API_REQUEST.SUCCESS, payload: type });
    yield put({ ...result });
  } catch (error) {
    const errorPayload = { error };
    if (error instanceof ServerError) {
      errorPayload.statusCode = error.response.error.status;
    }
    const errorAction = { type: `${type}_${ERROR}`, paylaod: error };
    yield put({ type: API_REQUEST.ERROR, payload: error });
    yield put(errorAction);
  }
}

export function* apiRequestSaga(action) {
  try {
    yield put({ type: `${action.type}_${PENDING}`, payload: action });
    yield put({ type: API_REQUEST.PENDING, payload: action });
  } catch (error) {
    throw error;
  }
}

export function* loadAppSaga(action) {
  try {
    setupClient({});
    yield fork(apiRequestSaga, {
      type: ROOT_API_REQUEST.ACTION,
      payload: action,
    });
    yield take(ROOT_API_REQUEST.SUCCESS);
    // All actions needed to load app successfully
    yield put({ type: LOAD_APP.SUCCESS });
  } catch (error) {
    yield put({ type: LOAD_APP.ERROR, payload: error });
  }
}

export function* requestErrorHandlerSaga(action) {
  try {
    const { payload } = action;
    const { statusCode } = payload;
    const { error } = payload;
    const {
      response: {
        header: { location },
      },
    } = error;
    switch (statusCode) {
      case 401:
      case 404:
      case 500:
        yield (window.location.href = location || '/');
        break;
      default:
        console.log({ error }); // eslint-disable-line
    }
  } catch (err) {
    throw new Error(err);
  }
}

export function* loadAppErrorHandlerSaga() {
  try {
    yield;
  } catch (error) {
    throw new Error(error);
  }
}

/* eslint-disable */
export const appWatchers = [
  takeLatest(LOAD_APP.ACTION, loadAppSaga),
  takeLatest(ROOT_API_REQUEST.ERROR, requestErrorHandlerSaga),
  takeLatest(API_REQUEST.ERROR, requestErrorHandlerSaga),
  takeLatest(LOAD_APP.ERROR, loadAppErrorHandlerSaga),
  takeEvery(API_REQUEST.PENDING, apiCallSaga),
  apiCallSaga(),
];
/* eslint-enable */

export default reducer;
