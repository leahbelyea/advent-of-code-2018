const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  return _.map(rawInput, coordinate => {
    const [, x, y, , vx, vy] = _.map(_.words(coordinate, /[^, <>=]+/g), _.toNumber);
    return {x, y, vx, vy};
  });
}

function printSky(sky) {
  _.each(sky, row => {
    console.log(_.join(row, ''));
  });
}

function moveStars(stars, seconds) {
  const currentPositions = [];
  _.each(stars, star => {
    const {x, y, vx, vy} = star;
    const xPos = x + (seconds * vx);
    const yPos = y + (seconds * vy);
    currentPositions.push({x: xPos, y: yPos});
  });

  const minX = _.minBy(currentPositions, 'x').x;
  const minY = _.minBy(currentPositions, 'y').y;

  _.map(currentPositions, position => {
      position.x -= minX;
      position.y -= minY;
    return position;
  });

  const maxX = _.maxBy(currentPositions, 'x').x;
  const maxY = _.maxBy(currentPositions, 'y').y;

  let sky;
  if (maxX < 100 && maxY < 100) {
    sky = Array(maxY + 1).fill('.').map(() => Array(maxX + 1).fill('.'));
    _.each(currentPositions, ({x, y}) => {
      sky[y][x] = '*';
    });
  } else {
    sky = null;
  }

  return sky;
}

exports.part1 = function(rawInput, isTest) {
  const input = formatInput(rawInput);
  let seconds = 0;
  const maxSeconds = isTest ? 10 : 100000;

  while (seconds < maxSeconds) {
    const sky = moveStars(input, seconds);
    if (sky) {
      printSky(sky);
    }
    seconds++;
  }

  return 'See output for answer';
};

exports.part2 = function(rawInput, isTest) {
  const input = formatInput(rawInput);
  let seconds = 0;
  const maxSeconds = isTest ? 10 : 100000;

  while (seconds < maxSeconds) {
    const sky = moveStars(input, seconds);
    if (sky) {
      console.log(seconds);
      printSky(sky);
      console.log('\n\n');
    }
    seconds++;
  }
  return 'See output for answer';
};
