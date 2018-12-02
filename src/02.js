const _ = require('lodash');

exports.inputType = 'array';

function findRepeats(id, repeatLength) {
  const letters = _.split(id, '');
  const letterCounts = _.values(_.countBy(letters));
  return _.includes(letterCounts, repeatLength);
}

function findCommonIdLetters(ids, differPosition) {
  let commonIdLetters;
  const idsWithSameCharAtPosition = _.map(ids, id => {
    return id.substr(0, differPosition) + '*' + id.substr(differPosition + 1)
  });

  _.uniqWith(idsWithSameCharAtPosition, (a, b) => {
    if (a === b) {
      commonIdLetters = _.replace(a, '*', '');
    }
    return a === b;
  });

  return commonIdLetters;
}

exports.part1 = function(rawInput) {
  let twiceCounts = 0;
  let thriceCounts = 0;
  _.each(rawInput, id => {
    if (findRepeats(id, 2)) {
      twiceCounts++;
    }
    if (findRepeats(id, 3)) {
      thriceCounts++;
    }
  });

  return twiceCounts * thriceCounts;
};

exports.part2 = function(rawInput) {
  let differPosition = 0;
  let commonIdLetters;

  while (!commonIdLetters) {
    commonIdLetters = findCommonIdLetters(rawInput, differPosition);
    differPosition++;
  }

  return commonIdLetters;
};
