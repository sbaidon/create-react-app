const fs = require('fs');
const path = require('path');

const modules = fs.readdirSync(path.join(__dirname, '../../src/modules'));

function moduleExists(component) {
  return modules.indexOf(component) >= 0;
}

module.exports = moduleExists;
