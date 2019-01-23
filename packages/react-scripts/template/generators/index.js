const componentGenerator = require('./component/index.js');
const moduleGenerator = require('./module/index.js');

module.exports = plop => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('module', moduleGenerator);
};
