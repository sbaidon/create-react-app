const componentExists = require('../utils/componentExists');
const properCase = require('../utils/properCase');

module.exports = {
  description: 'Create a new component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Component name:',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(properCase(value))
            ? 'A component with that name already exists'
            : true;
        }

        return 'Name is required';
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Component description:',
      validate: value => {
        const isEmpty = /.+/.test(value);

        return isEmpty ? true : 'Description is required';
      },
    },
    {
      type: 'confirm',
      name: 'hasMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
  ],
  actions: data => {
    console.log(data);
    const actions = [
      {
        type: 'add',
        path: '../src/components/{{properCase name}}/view.js',
        templateFile: './component/view.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../src/components/{{properCase name}}/styles.css',
        templateFile: './component/styles.css.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../src/components/{{properCase name}}/tests/view.test.js',
        templateFile: './component/view.test.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../src/components/{{properCase name}}/index.js',
        templateFile: './component/index.js.hbs',
        abortOnFail: true,
      },
    ];

    if (data.hasMessages) {
      actions.push({
        type: 'add',
        path: '../src/components/{{properCase name}}/messages.js',
        templateFile: './component/messages.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
