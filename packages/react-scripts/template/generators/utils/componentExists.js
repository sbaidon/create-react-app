const fs = require('fs');
const path = require('path');

const components = fs.readdirSync(path.join(__dirname, '../../src/components'));

function componentExists(component) {
  return components.indexOf(component) >= 0;
}

module.exports = componentExists;
