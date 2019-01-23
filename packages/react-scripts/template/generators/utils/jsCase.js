function jsCase(str) {
  return str
    .replace(/\w\S*/g, txt => txt.charAt(0).toLowerCase() + txt.substr(1))
    .replace(/^\s+|\s+$/g, '')
    .replace(' ', '');
}

module.exports = jsCase;
