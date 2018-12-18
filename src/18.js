const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  return _.map(rawInput, line => {
    return _.split(line, '');
  });
}

function getNextType(state, [x, y]) {
  const stateYSize = _.size(state);
  const stateXSize = _.size(state[0]);
  const downInRange = y + 1 < stateYSize;
  const upInRange = y - 1 >= 0;
  const leftInRange = x - 1 >= 0;
  const rightInRange = x + 1 < stateXSize;
  let surroundingTypes = [
    upInRange && leftInRange ? state[y - 1][x - 1] : null,
    upInRange ? state[y - 1][x] : null,
    upInRange && rightInRange ? state[y - 1][x + 1] : null,
    leftInRange ? state[y][x - 1] : null,
    rightInRange ? state[y][x + 1] : null,
    downInRange && leftInRange ? state[y + 1][x - 1] : null,
    downInRange ? state[y + 1][x] : null,
    downInRange && rightInRange ? state[y + 1][x + 1] : null,
  ];

  surroundingTypes = _.compact(surroundingTypes);
  const numTrees = _.size(_.filter(surroundingTypes, type => type === '|'));
  const numLumberyards = _.size(_.filter(surroundingTypes, type => type === '#'));
  const currentType = state[y][x];

  switch(currentType) {
    case '.':
      if (numTrees >= 3) {
        return '|';
      }
      break;

    case '|':
      if (numLumberyards >= 3) {
        return '#';
      }
      break

    case '#':
      if (numLumberyards < 1 || numTrees < 1) {
        return '.';
      }
      break
  }

  return currentType;
}

function getNextState(state) {
  const newState = Array(_.size(state)).fill().map(() => Array(_.size(state[0])).fill());

  _.each(state, (row, y) => {
    _.each(row, (colum, x) => {
      newState[y][x] = getNextType(state, [x, y]);
    });
  });

  return newState;
}

function getResourceValue(state) {
  const numTrees = _.size(_.filter(_.flatten(state), type => type === '|'));
  const numLumberyards = _.size(_.filter(_.flatten(state), type => type === '#'));
  return numTrees * numLumberyards;
}

exports.part1 = function(rawInput) {
  let state = formatInput(rawInput);

  _.times(10, () => {
    state = getNextState(state);
  });

  return getResourceValue(state);
};

// Part 2: after awhile, the state "stabilizes" and repeats itself every 28 cycles
exports.part2 = function(rawInput) {
  let state = formatInput(rawInput);
  let results = [];
  const times = 1000;
  const sliceSize = 100;

  _.times(times, () => {
    state = getNextState(state);
    results.push(getResourceValue(state));
  });

  results = _.uniq(results.slice(0 - sliceSize));
  const resultIndex = (1000000000 - times - 1 + sliceSize) % _.size(results);

  return results[resultIndex];
};
