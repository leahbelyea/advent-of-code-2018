const _ = require('lodash');

exports.inputType = 'string';

function makeRecipes(scoreBoard, elfPositions) {
  let newRecipes = ((scoreBoard[elfPositions[0]] + scoreBoard[elfPositions[1]]) + '').split('').map(x => parseInt(x, 10));
  scoreBoard.push(...newRecipes);

  elfPositions = elfPositions.map(position => {
    return (position + scoreBoard[position] + 1) % scoreBoard.length;
  });

  return {scoreBoard, elfPositions};
}

exports.part1 = function(rawInput) {
  const input = _.toNumber(rawInput);
  let scoreBoard = [3, 7];
  let elfPositions = [0, 1];

  while (_.size(scoreBoard) < (input + 10)) {
    ({scoreBoard, elfPositions} = makeRecipes(scoreBoard, elfPositions));
  }

  return _.join(_.slice(scoreBoard, input, input + 10), '');
};

exports.part2 = function(rawInput) {
  const loops = 30000000;
  const scoreBoard = Array(loops).fill(0);
  scoreBoard[0] = 3;
  scoreBoard[1] = 7;
  let scoreBoardSize = 2;
  let elfPositions = [0, 1];

  for (loop = 0; loop < loops; loop++) {
    let newRecipes = ((scoreBoard[elfPositions[0]] + scoreBoard[elfPositions[1]]) + '').split('').map(x => parseInt(x, 10));
    for(let i = 0; i < newRecipes.length; i++) {
      scoreBoard[scoreBoardSize] = newRecipes[i];
      scoreBoardSize++;
    }
    elfPositions = elfPositions.map(position => {
      return (position + scoreBoard[position] + 1) % scoreBoardSize;
    });
  }

  let sequence = '';
  const sequenceLength = rawInput.length;
  const firstDigit = parseInt(rawInput[0], 10);
  for (let i = 0; i < scoreBoard.length; i++) {
    if (scoreBoard[i] === firstDigit) {
      for (let j = 0; j < sequenceLength; j++) {
        sequence += scoreBoard[i + j];
      }
      if (sequence === rawInput) {
        return i;
      } else {
        sequence = '';
      }
    }
  }
};
