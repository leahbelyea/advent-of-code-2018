const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  const initialState = _.split(_.replace(rawInput[0], 'initial state: ', ''), '');

  const notes = {};
  _.each(_.slice(rawInput, 1), (line, index) => {
    const [state, result] = _.split(line, ' => ');
    notes[state] = result;
  })

  return {initialState, notes};
}

function generate(pots, notes) {
  const updatedPots = [];
  _.each(pots, (pot, index) => {
    if (index < 2 || index > _.size(pots) - 2) {
      updatedPots[index] = '.';
      return true;
    }
    const potPattern = _.padEnd(_.join(_.slice(pots, index - 2, index + 3), ''), 5, '.');
    let newPot = notes[potPattern] || '.';
    updatedPots[index] = newPot;
  });
  return updatedPots;
}

function getSum(pots, zeroPos) {
  let sum = 0;

  _.each(pots, (pot, index) => {
    if (pot === '#') {
      sum += (index - zeroPos);
    }
  });

  return sum;
}

function getRepeatStart(pots, notes) {
  let repeatFound = false;
  let repeatStart = 0;
  let oldPots;

  while (!repeatFound) {
    oldPots = [...pots];
    pots = ['.', '.', '.'].concat(pots).concat(['.', '.', '.']);
    pots = generate(pots, notes);
    let potString = _.join(pots, '');
    potString = _.trimStart(potString, '.');
    potString = _.trimEnd(potString, '.');
    if (potString === _.join(oldPots, '')) {
      repeatFound = true;
    }
    pots = _.split(potString, '');
    repeatStart++;
  }

  return {repeatedPots: pots, repeatStart};
}

function getZeroPos([a, b], times) {
  const slope = (a[1] - b[1])/(a[0] - b[0]);
  const intercept = a[1] - (slope * a[0]);
  return (slope * times) + intercept;
}

exports.part1 = function(rawInput) {
  const {initialState, notes} = formatInput(rawInput);
  let zeroPos = 0;
  let pots = initialState;

  _.times(20, () => {
    pots = ['.', '.', '.'].concat(pots).concat(['.', '.', '.']);
    zeroPos += 3;
    pots = generate(pots, notes);
    let potString = _.join(pots, '');
    potString = _.trimStart(potString, '.');
    zeroPos -= _.size(pots) - _.size(potString);
    potString = _.trimEnd(potString, '.');
    pots = _.split(potString, '');
  });

  return getSum(pots, zeroPos);
};

exports.part2 = function(rawInput) {
  const {initialState, notes} = formatInput(rawInput);
  const {repeatedPots, repeatStart} = getRepeatStart(initialState, notes);
  const timesA = repeatStart + 100;
  const timesB = timesA * 10;
  let zeroPosA = 0;
  let zeroPosB = 0;

  let pots = initialState;
  _.times(timesA, () => {
    pots = ['.', '.', '.'].concat(pots).concat(['.', '.', '.']);
    zeroPosA += 3;
    pots = generate(pots, notes);
    let potString = _.join(pots, '');
    potString = _.trimStart(potString, '.');
    zeroPosA -= _.size(pots) - _.size(potString);
    potString = _.trimEnd(potString, '.');
    pots = _.split(potString, '');
  });

  pots = initialState;
  times =
  _.times(timesB, () => {
    pots = ['.', '.', '.'].concat(pots).concat(['.', '.', '.']);
    zeroPosB += 3;
    pots = generate(pots, notes);
    let potString = _.join(pots, '');
    potString = _.trimStart(potString, '.');
    zeroPosB -= _.size(pots) - _.size(potString);
    potString = _.trimEnd(potString, '.');
    pots = _.split(potString, '');
  });

  const zeroPos = getZeroPos([[timesA, zeroPosA], [timesB, zeroPosB]], 50000000000);
  return getSum(repeatedPots, zeroPos);
};
