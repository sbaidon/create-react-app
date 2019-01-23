import React from 'react';
import { shallow } from 'enzyme';
import { defineMessages } from 'react-intl';

import LanguageProvider from 'modules/LanguageProvider/view';
import { DEFAULT_LOCALE } from 'store/constants';

const messages = defineMessages({
  // This is a test text
  someText: 'I am a text',
});

describe('<LanguageProvider />', () => {
  it('should render its children', () => {
    const children = <div>Hello!</div>; // eslint-disable-line react/jsx-no-literals
    const wrapper = shallow(
      <LanguageProvider locale="en" messages={messages}>
        {children}
      </LanguageProvider>,
      {}
    );

    expect(wrapper.contains(children)).toBe(true);
  });

  it(`should render ${DEFAULT_LOCALE} as its default locale`, () => {
    const children = <div>Hello!</div>; // eslint-disable-line react/jsx-no-literals
    const wrapper = shallow(
      <LanguageProvider messages={messages}>{children}</LanguageProvider>,
      {}
    );

    expect(wrapper.prop('locale')).toBe(DEFAULT_LOCALE);
  });
});
