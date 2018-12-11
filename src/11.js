const _ = require('lodash');

exports.inputType = 'string';

function formatInput(rawInput) {
  return _.toNumber(rawInput);
}

function findSquarePower(topLeft, serialNumber, size) {
  if (topLeft[0] >= (300 - size) || topLeft[1] >= (300 - size)) {
    return '-';
  }

  const subGrid = Array(size).fill('').map(() => Array(size).fill(''));

  _.each(subGrid, (row, x) => {
    _.each(row, (column, y) => {
      const rackId = 10 + (topLeft[0] + x);
      let power = rackId * (topLeft[1] + y);
      power = power + serialNumber;
      power = power * rackId;
      power = _.padStart(_.toString(power), 3, 0);
      power = _.toNumber(power[power.length - 3]);
      power -= 5;
      subGrid[y][x] = power;
    })
  })

  return _.sum(_.flatten(subGrid));
}

exports.part1 = function(rawInput) {
  const input = formatInput(rawInput);
  const totalPowers = Array(300).fill('').map(() => Array(300).fill(''));

  _.each(totalPowers, (row, y) => {
    _.each(totalPowers, (column, x) => {
      const total3x3Power = findSquarePower([x, y], input, 3
      );
      totalPowers[y][x] = total3x3Power;
    });
  });

  const max = _.max(_.flatten(totalPowers));
  let maxCoords;
  _.each(totalPowers, (row, x) => {
    const maxIndex = row.indexOf(max);
    if (maxIndex > -1) {
      maxCoords = [maxIndex, x];
    }
  });

  return _.join(maxCoords, ',');
};

exports.part2 = function(rawInput) {
  const input = formatInput(rawInput);
  let size = 1;
  let max;
  let maxCoords;
  let maximumReached = false;

  while (!maximumReached) {
    const start = Date.now();
    const totalPowers = Array(300).fill('').map(() => Array(300).fill(''));

    _.each(totalPowers, (row, y) => {
      _.each(totalPowers, (column, x) => {
        const totalSquarePower = findSquarePower([x, y], input, (size));
        totalPowers[y][x] = totalSquarePower;
      });
    });

    const maxForSize = _.max(_.flatten(totalPowers));

    if (!max || maxForSize > max) {
      let maxCoordsForSize;
      _.each(totalPowers, (row, x) => {
        const maxIndex = row.indexOf(maxForSize);
        if (maxIndex > -1) {
          maxCoordsForSize = [maxIndex, x, size];
        }
      });

      max = maxForSize;
      maxCoords = maxCoordsForSize;
    }

    if (maxForSize < 0) {
      maximumReached = true;
    }

    size++;
  }

  return _.join(maxCoords, ',');
};
