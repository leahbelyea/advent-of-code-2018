const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  return _.map(rawInput, _.toNumber);
}

exports.part1 = function(rawInput) {
  const input = formatInput(rawInput);
  return _.sum(input);
};

exports.part2 = function(rawInput) {
  const input = formatInput(rawInput);
  const results = [0];
  let firstRepeat;

  while (firstRepeat === undefined) {
    _.each(input, number => {
      const result = _.last(results) + number;
      if (_.includes(results, result)) {
        firstRepeat = result;
        return false;
      } else {
        results.push(result);
      }
    });
  }

  return firstRepeat;
};
