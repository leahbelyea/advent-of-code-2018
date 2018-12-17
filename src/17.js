const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  return _.map(rawInput, line => {
    const [left, right] = _.split(line, ', ');
    let x, y;

    if (left[0] === 'x') {
      x = _.toNumber(_.replace(left, 'x=', ''));
      y = _.map(_.split(_.replace(right, 'y=', ''), '..'), _.toNumber);
    } else {
      y = _.toNumber(_.replace(left, 'y=', ''));
      x = _.map(_.split(_.replace(right, 'x=', ''), '..'), _.toNumber);
    }
    return {x, y};
  });
}

function buildMap(input) {
  const xs = _.flatten(_.map(input, 'x'));
  const buffer = 10;
  const xOffset = _.min(xs) - buffer;
  const xRange = _.max(xs) - _.min(xs) + (2 * buffer);
  const minY = _.min(_.flatten(_.map(input, 'y')));
  const maxY = _.max(_.flatten(_.map(input, 'y')));
  const spring = [500 - xOffset, 0];
  let map = Array(maxY + 1).fill().map(() => Array(xRange).fill('.'));
  map[spring[1]][spring[0]] = '+';

  _.each(input, ({x, y}) => {
    if (_.isArray(x)) {
      let i = x[0];
      while (i <= x[1]) {
        map[y][i - xOffset] = '#';
        i++;
      }
    } else {
      let j = y[0];
      while (j <= y[1]) {
        map[j][x - xOffset] = '#';
        j++;
      }
    }
  });

  return {spring, map};
}

function moveWater(map, spring) {
  let [x, y] = spring;
  let id = 0;
  streams = [{
    id,
    x: spring[0],
    y: spring[1] + 1,
    direction: 'd'
  }];

  while (_.size(streams) > 0) {
    _.each(streams, stream => {
      if (stream.direction === 'd') {
        // Get to bottom
        let atBottom = false;
        while (!atBottom) {
          map[stream.y][stream.x] = '|';
          if (!map[stream.y + 1]) {
            // Stream is done, removed from list
            streams = _.filter(streams, ({id}) => id !== stream.id);
            return true;
          }
          if (map[stream.y + 1][stream.x] === '#' || map[stream.y + 1][stream.x] === '~') {
            atBottom = true;
          } else {
            stream.y++;
          }
        }

        // Get left and right bounds
        let leftBound = stream.x;
        let rightBound = stream.x;
        while (map[stream.y][leftBound] !== '#') {
          leftBound--;
          if (leftBound === 0) {
            leftBound = null;
            break;
          }
        }
        while (map[stream.y][rightBound] !== '#') {
          rightBound++;
          if (rightBound === _.size(map[0])) {
            rightBound = null;
            break;
          }
        }

        // Check for full bottom
        let hasFullBottom = false;
        if (leftBound && rightBound) {
          hasFullBottom = true;
          let leftX = leftBound;
          while (leftX <= rightBound) {
            if (map[stream.y + 1][leftX] !== '#' && map[stream.y + 1][leftX] !== '~') {
              hasFullBottom = false;
            }
            leftX++;
          }
        }

        // Fill bottom
        if (hasFullBottom) {
          let leftX = leftBound + 1;
          while (leftX < rightBound) {
            map[stream.y][leftX] = '~';
            leftX++;
          }
          stream.y--;
        } else {
          // Add new streams going to left and right
          id++;
          streams.push({
            id,
            x: stream.x - 1,
            y: stream.y,
            direction: 'l'
          });
          id++;
          streams.push({
            id,
            x: stream.x + 1,
            y: stream.y,
            direction: 'r'
          });

          // Down stream is done, removed from list
          streams = _.filter(streams, ({id}) => id !== stream.id);
          return true;
        }
      } else {
        // Go sideways until you hit a wall or there is no bottom
        let noBottom = false;
        while (!noBottom) {
          const nextX = stream.direction === 'l' ? stream.x - 1 : stream.x + 1;
          if (map[stream.y][stream.x] === '#') {
            break;
          } else if (map[stream.y + 1][stream.x] !== '#' && map[stream.y + 1][stream.x] !== '~') {
            noBottom = true;
          } else {
            map[stream.y][stream.x] = '|';
            stream.x = nextX;
          }
        }

        if (noBottom) {
          // change direction
          stream.direction = 'd';
        } else {
          // Stream is done, removed from list
          streams = _.filter(streams, ({id}) => id !== stream.id);
          return true;
        }
      }
    });
  }

  return map;
}

exports.part1 = function(rawInput) {
  const input = formatInput(rawInput);
  let {spring, map} = buildMap(input);
  map = moveWater(map, spring);

  const minY = _.min(_.flatten(_.map(input, 'y')));
  const mapSliced = map.slice(minY);
  return waterTileCount = _.size(_.filter(_.flatten(mapSliced), tile => tile === '|' || tile === '~'));
};

exports.part2 = function(rawInput) {
  const input = formatInput(rawInput);
  let {spring, map} = buildMap(input);
  map = moveWater(map, spring);

  const minY = _.min(_.flatten(_.map(input, 'y')));
  const mapSliced = map.slice(minY);
  return waterTileCount = _.size(_.filter(_.flatten(mapSliced), tile => tile === '~'));
};
