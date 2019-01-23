import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';
import { FormattedMessage, defineMessages } from 'react-intl';

import ConnectedLanguageProvider from 'modules/LanguageProvider';

const messages = defineMessages({
  // This is a test text
  someText: 'I am a text',
});

describe('Connected <LanguageProvider />', () => {
  const initialState = fromJS({
    resources: {
      languageProvider: {
        language: 'en',
      },
    },
  });

  let mockStore;
  let store;

  beforeAll(() => {
    mockStore = configureStore([]);
    store = mockStore(initialState);
  });

  it('should render the default language messages', () => {
    const wrapper = mount(
      <ConnectedLanguageProvider locale="en" messages={messages}>
        <FormattedMessage {...messages.someText} />
      </ConnectedLanguageProvider>,
      {
        context: { store },
        childContextTypes: { store: PropTypes.object.isRequired },
      }
    );

    expect(wrapper.contains(<FormattedMessage {...messages.someText} />)).toBe(
      true
    );
  });
});
