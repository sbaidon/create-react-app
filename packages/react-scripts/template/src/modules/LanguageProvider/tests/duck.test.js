import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import reducer, {
  CHANGE_LANGUAGE,
  changeLanguage,
  getSettings,
  makeGetLocale,
} from 'modules/LanguageProvider/duck';

describe('LanguageProvider duck', () => {
  beforeAll(() => {
    jest.addMatchers(matchers);
  });

  describe('actions', () => {
    it('changeLanguage', () => {
      const fixture = { language: 'es' };
      const expected = {
        type: CHANGE_LANGUAGE.SUCCESS,
        payload: fixture,
      };

      expect(changeLanguage(fixture)).toEqual(expected);
    });
  });

  describe('reducer', () => {
    const fixture1 = { language: 'es' };
    const fixture2 = { language: 'fr' };
    const fixture3 = { language: 'de' };

    let initialState;

    beforeAll(() => {
      initialState = fromJS({
        language: 'en',
      });
    });

    it('should return initial immutable state', () => {
      expect(reducer(undefined, {})).toBeImmutableMap();
    });

    it('should handle changeLanguage', () => {
      const getExpected = fixture =>
        initialState.setIn(['language'], fixture.language);

      expect(reducer(undefined, changeLanguage(fixture1))).toEqual(
        getExpected(fixture1)
      );
      expect(reducer(undefined, changeLanguage(fixture2))).toEqual(
        getExpected(fixture2)
      );
      expect(reducer(undefined, changeLanguage(fixture3))).toEqual(
        getExpected(fixture3)
      );
    });
  });

  describe('selectors', () => {
    describe('getSettings', () => {
      it('should select the languageProvider domain', () => {
        const settingsState = fromJS({
          language: 'es',
        });
        const mockedState = fromJS({
          resources: {
            languageProvider: settingsState,
          },
        });

        expect(getSettings(mockedState)).toEqual(settingsState);
      });
    });

    describe('makeGetLocale', () => {
      const selectLanguage = makeGetLocale();

      it('should select the language', () => {
        const language = 'de';
        const mockedState = fromJS({
          resources: {
            languageProvider: { language },
          },
        });

        expect(selectLanguage(mockedState)).toEqual(language);
      });
    });
  });
});
