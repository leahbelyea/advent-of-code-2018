const _ = require('lodash');

exports.inputType = 'string';

function getSmallestPolymer(inputPolymer) {
  const targetCharDiff = 32;
  let charNum = 97;
  const charEnd = 122;
  const charGroups = [];
  while (charNum <= charEnd) {
    charGroups.push(String.fromCharCode(charNum) + String.fromCharCode(charNum - targetCharDiff));
    charGroups.push(String.fromCharCode(charNum - targetCharDiff) + String.fromCharCode(charNum));
    charNum++;
  }
  const re = new RegExp(_.join(charGroups, '|'));

  let polymer;
  let newPolymer = inputPolymer;
  while (polymer !== newPolymer) {
    polymer = newPolymer;
    newPolymer = _.replace(polymer, re, '');
  }
  return polymer;
}

exports.part1 = function(rawInput) {
  return _.size(getSmallestPolymer(rawInput));
};

exports.part2 = function(rawInput) {
  const polymer = rawInput;
  let charNum = 97;
  const charEnd = 122;
  let shortestPolymerResult;

  while (charNum <= charEnd) {
    const re = new RegExp(`[${String.fromCharCode(charNum)}]`, 'gi');
    const strippedPolymer = _.replace(polymer, re, '');
    const resultingPolymer = getSmallestPolymer(strippedPolymer);
    if (!shortestPolymerResult || _.size(resultingPolymer) <_.size(shortestPolymerResult)) {
      shortestPolymerResult = resultingPolymer;
    }
    charNum++;
  }

  return _.size(shortestPolymerResult);
};
