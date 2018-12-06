const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  const formattedInput = {};
  _.each(rawInput, (location, index) => {
    const label = _.padStart(index + 1, 2, '0');
    formattedInput[label] = _.map(_.split(location, ', '), _.toNumber);
  });

  return formattedInput;
}

function printGrid(grid) {
  _.each(grid, row => {
    console.log(_.join(row, ''));
  });
}

function addLocationsToGrid(grid, locations) {
  _.each(locations, (location, label) => {
    const [x, y] = location;
    grid[y][x] = '(' + label + ')';
  });
  return grid;
}

function getNearestPoints(locations, coordinate) {
  const distances = {};
  _.each(locations, (location, label) => {
    const distance = Math.abs(location[0] - coordinate[0]) + Math.abs(location[1] - coordinate[1]);
    distances[label] = distance;
  });

  const nearestDistance = _.min(_.values(distances));
  const nearestPoints = _.filter(_.keys(distances), d => distances[d] === nearestDistance);
  return nearestPoints;
}

function populateDistances(grid, locations) {
  _.each(grid, (row, x) => {
    _.each(row, (column, y) => {
      if (grid[y][x] === '') {
        nearestPoints = getNearestPoints(locations, [x, y]);
        grid[y][x] = _.size(nearestPoints) > 1 ? '.' :  _.first(nearestPoints);
      }
    });
  });
  return grid;
}

function findLargestArea(grid, locations) {
  const leftEdge = [];
  const rightEdge = [];
  _.each(grid, row => {
    leftEdge.push(_.first(row));
    rightEdge.push(_.last(row));
  });
  const edges = _.flatten([_.first(grid), _.last(grid), leftEdge, rightEdge]);
  const infiniteAreas = _.map(_.filter(_.uniq(edges), location => location !== '.'), _.trim);
  const gridFlattened = _.flatten(grid);

  let largestAreaSize;
  _.each(locations, (location, label) => {
    if (_.includes(infiniteAreas, label)) {
      return true;
    }
    const size = _.size(_.filter(gridFlattened, l => l === label || l === `(${label})`))
    if (!largestAreaSize || size > largestAreaSize) {
      largestAreaSize = size;
    }
  });

  return largestAreaSize;
}

function isWithinSafeRegion(locations, coordinate) {
  const safeDistance = _.size(_.keys(locations)) === 6 ? 32 : 10000;
  let manhattanSum = 0;
  _.each(locations, location => {
    manhattanSum += Math.abs(location[0] - coordinate[0]) + Math.abs(location[1] - coordinate[1]);
  });
  return manhattanSum < safeDistance;
}

function markSafeRegion(grid, locations) {
  _.each(grid, (row, x) => {
    _.each(row, (column, y) => {
      if (isWithinSafeRegion(locations, [x, y])) {
        grid[y][x] = '#';
      }
    });
  });
  return grid;
}

exports.part1 = function(rawInput) {
  const input = formatInput(rawInput);
  const gridSize = 500;
  let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
  grid = addLocationsToGrid(grid, input);
  grid = populateDistances(grid, input);
  const largestArea = findLargestArea(grid, input);
  return largestArea;
};

exports.part2 = function(rawInput) {
  const input = formatInput(rawInput);
  const gridSize = 500;
  let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
  grid = addLocationsToGrid(grid, input);
  grid = markSafeRegion(grid, input);
  return _.size(_.filter(_.flatten(grid), c => c === '#'));
};
