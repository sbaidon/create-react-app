import * as matchers from 'jest-immutable-matchers';
import { fromJS } from 'immutable';

import { ADD_TODO } from 'modules/ToDos/duck';
import rootReducer, { clearReduxForm } from 'store/reducer';

describe('rootReducer', () => {
  beforeAll(() => {
    jest.addMatchers(matchers);
  });

  it('should return initial immutable state', () => {
    expect(rootReducer(undefined, {})).toBeImmutableMap();
  });

  describe('entities reducer', () => {
    it('should contain an entities reducer', () => {
      expect(rootReducer(undefined, {}).toJS()).toHaveProperty('entities');
    });

    it('should update entities when an action has an entities property', () => {
      const initialState = fromJS({
        entities: {
          todos: {},
        },
      });

      expect(
        rootReducer(initialState, {
          type: 'SOME-ACTION',
          payload: fromJS({}),
          entities: fromJS({
            todos: {
              'some-id': 'This is a new todo',
            },
          }),
        }).getIn(['entities', 'todos']).size
      ).toEqual(1);
    });

    it('should replace entities objects, not merge them', () => {
      const initialState = fromJS({
        entities: {
          users: {
            '1abc': {
              id: '1abc',
              name: 'James',
              email: 'james@domain.com',
              _links: {
                get: '/user/1abc',
                put: '/user/1abc',
              },
            },
            '2abc': {
              id: '2abc',
              name: 'Watson',
              email: 'watson@domain.com',
              _links: {
                get: '/user/2abc',
                put: '/user/2abc',
              },
            },
          },
          categories: {
            '1dfg': {
              name: 'Movies',
              _links: {
                get: '/categories/1dfg',
              },
            },
            '2dfg': {
              name: 'Music',
              _links: {
                get: '/categories/2dfg',
                put: '/categories/2dfg',
              },
            },
          },
        },
      });

      const updatedEntities = fromJS({
        users: {
          '2abc': {
            id: '2abc',
            name: 'Watson',
            _links: {
              get: '/user/2abc',
            },
          },
        },
        categories: {
          '1dfg': {
            name: 'Movies',
            _links: {
              get: '/categories/1dfg',
              put: '/categories/1dfg',
              post: '/categories/1dfg',
            },
          },
        },
      });

      const expectedResult = fromJS({
        users: {
          '1abc': {
            id: '1abc',
            name: 'James',
            email: 'james@domain.com',
            _links: {
              get: '/user/1abc',
              put: '/user/1abc',
            },
          },
          '2abc': {
            id: '2abc',
            name: 'Watson',
            _links: {
              get: '/user/2abc',
            },
          },
        },
        categories: {
          '1dfg': {
            name: 'Movies',
            _links: {
              get: '/categories/1dfg',
              put: '/categories/1dfg',
              post: '/categories/1dfg',
            },
          },
          '2dfg': {
            name: 'Music',
            _links: {
              get: '/categories/2dfg',
              put: '/categories/2dfg',
            },
          },
        },
      });

      expect(
        rootReducer(initialState, {
          type: 'SOMEACTION',
          payload: fromJS({}),
          entities: updatedEntities,
        }).get('entities')
      ).toEqual(expectedResult);
    });
  });

  describe('form reducer', () => {
    it('should contain a form reducer', () => {
      expect(rootReducer(undefined, {}).toJS()).toHaveProperty('form');
    });

    it('should be able to clearReduxForm', () => {
      const initialState = fromJS({
        values: { test: 'hello' },
        fields: {
          test: { visited: true, touched: true },
        },
      });

      expect(clearReduxForm(initialState).get('values').size).toEqual(0);
      expect(
        clearReduxForm(initialState).getIn(['fields', 'test', 'touched'])
      ).toEqual(false);
    });

    it('addTodo reducer should clearReduxForm on ADD_TODO.SUCCESS', () => {
      const initialState = fromJS({
        form: {
          addTodo: {
            values: { test: 'hello' },
            fields: {
              test: { visited: true, touched: true },
            },
          },
        },
        resources: { todos: [] },
      });

      expect(
        rootReducer(initialState, {
          type: ADD_TODO.SUCCESS,
          payload: fromJS({}),
        }).getIn(['form', 'addTodo', 'values']).size
      ).toEqual(0);
      expect(
        rootReducer(initialState, {
          type: ADD_TODO.SUCCESS,
          payload: fromJS({}),
        }).getIn(['form', 'addTodo', 'fields', 'test', 'touched'])
      ).toEqual(false);
    });
  });
});
