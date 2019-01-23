const moduleExists = require('../utils/moduleExists');
const properCase = require('../utils/properCase');

module.exports = {
  description: 'Create a new module',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Module name:',
      validate: value => {
        if (!/.+/.test(value)) {
          return 'Name is required';
        }

        if (moduleExists(properCase(value))) {
          return 'A module with that name already exists';
        }

        if (/^[A-Z]/.test(value)) {
          return 'Module name should start with lowercase';
        }

        if (/\s/.test(value)) {
          return 'Module name should not have any spaces';
        }

        return true;
      },
    },
    {
      type: 'confirm',
      name: 'hasMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this module use text)?',
    },
    {
      type: 'confirm',
      name: 'hasStyles',
      default: true,
      message: 'Do you want to use styles (i.e. will this module use CSS)?',
    },
    {
      type: 'confirm',
      name: 'isReduxForm',
      default: true,
      message: 'Is this a redux-form module?',
    },
  ],
  actions: data => {
    const actions = [
      {
        type: 'add',
        path: '../src/modules/{{properCase name}}/index.js',
        templateFile: './module/index.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../src/modules/{{properCase name}}/styles.css',
        templateFile: './module/styles.css.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../src/modules/{{properCase name}}/tests/view.test.js',
        templateFile: './module/view.test.js.hbs',
        abortOnFail: true,
      },
    ];

    if (data.hasMessages) {
      actions.push({
        type: 'add',
        path: '../src/modules/{{properCase name}}/messages.js',
        templateFile: './module/messages.js.hbs',
        abortOnFail: true,
      });
    }

    if (data.isReduxForm) {
      actions.push({
        type: 'add',
        path: '../src/modules/{{properCase name}}/view.js',
        templateFile: './module/view.redux-form.js.hbs',
        abortOnFail: true,
      });
    } else {
      actions.push({
        type: 'add',
        path: '../src/modules/{{properCase name}}/view.js',
        templateFile: './module/view.js.hbs',
        abortOnFail: true,
      });

      actions.push({
        type: 'add',
        path: '../src/modules/{{properCase name}}/duck.js',
        templateFile: './module/duck.js.hbs',
        abortOnFail: true,
      });

      actions.push({
        type: 'add',
        path: '../src/modules/{{properCase name}}/tests/duck.test.js',
        templateFile: './module/duck.test.js.hbs',
        abortOnFail: true,
      });

      actions.push({
        type: 'add',
        path: '../src/modules/{{properCase name}}/tests/index.test.js',
        templateFile: './module/index.test.js.hbs',
        abortOnFail: true,
      });

      actions.push({
        type: 'append',
        path: '../src/store/reducer.js',
        pattern: /(import languageProvider from 'modules\/LanguageProvider\/duck')/g,
        templateFile: './module/import-reducer.js.hbs',
      });

      actions.push({
        type: 'append',
        path: '../src/store/reducer.js',
        pattern: /( {2}languageProvider,)/g,
        templateFile: './module/resources-reducer-name.js.hbs',
      });

      actions.push({
        type: 'append',
        path: '../src/store/saga.js',
        pattern: /(from 'redux-saga\/effects')/g,
        templateFile: './module/import-saga.js.hbs',
      });

      actions.push({
        type: 'append',
        path: '../src/store/saga.js',
        pattern: /( {2}yield all\(\[)/g,
        templateFile: './module/saga-name.js.hbs',
      });
    }

    return actions;
  },
};
