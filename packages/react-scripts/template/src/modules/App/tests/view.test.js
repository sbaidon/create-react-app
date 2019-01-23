import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import App from 'modules/App';

describe('<App />', () => {
  let mockStore;
  let store;
  let wrapper;

  beforeAll(() => {
    mockStore = configureStore([]);
    store = mockStore({});
    wrapper = shallow(<App store={store} />);
  });

  it('should render some <Route />s', () => {
    expect(wrapper.find('Route').length).not.toBe(0);
  });
});
