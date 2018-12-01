const fs = require('fs');
const _ = require('lodash');

// Reads entire file contents into one string
exports.getInputString = function (filename) {
  return _.trim(fs.readFileSync(`input/${filename}`, 'utf8'));
}

// Reads each line of file contents into array
exports.getInputArray = function (filename) {
  return _.compact(_.split(fs.readFileSync(`input/${filename}`, 'utf8'), '\n'));
}
