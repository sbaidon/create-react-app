import configureStore from 'store/configureStore';

describe('configureStore', () => {
  let store;

  it('should be able to create a store with initial state', () => {
    store = configureStore({
      resources: {
        languageProvider: { language: 'fr' },
      },
    });

    expect(
      store.getState().getIn(['resources', 'languageProvider', 'language'])
    ).toEqual('fr');
  });

  it('should call window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__', () => {
    const compose = jest.fn();

    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = () => compose;
    configureStore();

    expect(compose).toHaveBeenCalled();
  });
});
