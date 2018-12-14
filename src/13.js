const _ = require('lodash');

exports.inputType = 'array';

const cartPositions = ['^', '>', 'v', '<'];
const turningDirections = ['left', 'straight', 'right'];

function formatInput(rawInput) {
  const cartLocations = [];
  const map = [];
  let id = 1;

  _.each(rawInput, (line, y) => {
    const row = _.split(line, '');
    _.each(row, (column, x) => {
      if (_.includes(cartPositions, column)) {
        cartLocations.push(
          {
            id,
            location: [x, y],
            direction: column,
            turnCount: 0
          }
        );
        id++;
        row[x] = _.includes(['^', 'v'], column) ? '|' : '-';
      }
    });

    map.push(row);
  });

  return {map, cartLocations};
}

function getNextLocation(coord, direction) {
  if (direction === '^') {
    return [coord[0], coord[1] - 1];
  }
  if (direction === 'v') {
    return [coord[0], coord[1] + 1];
  }
  if (direction === '>') {
    return [coord[0] + 1, coord[1]];
  }
  if (direction === '<') {
    return [coord[0] - 1, coord[1]];
  }
}

function moveCarts(map, cartLocations) {
  let collision;

  _.each(cartLocations, (cart, index) => {
    const location = getNextLocation(cart.location, cart.direction);
    const mapElement = map[location[1]][location[0]];
    let direction = cart.direction;
    let turnCount = cart.turnCount;
    let turnDirection;

    if (mapElement === '+') {
      turnDirection = turningDirections[turnCount % 3];
      turnCount++;
    } else if (_.includes(['/', '\\'], mapElement)) {
      if (_.includes(['^', 'v'], direction)) {
        turnDirection = mapElement === '/' ? 'right' : 'left';
      } else {
        turnDirection = mapElement === '/' ? 'left' : 'right';
      }
    }

    if (turnDirection === 'left') {
      direction = cartPositions[(_.indexOf(cartPositions, cart.direction) + 3) % 4];
    } else if (turnDirection === 'right') {
      direction = cartPositions[(_.indexOf(cartPositions, cart.direction) + 1) % 4];
    }

    const cartLocationStrings = _.map(cartLocations, cart => {
      return _.join(cart.location, ',')
    });
    const cartLocationString =  _.join(location, ',');
    if (_.includes(cartLocationStrings, cartLocationString)) {
      collision = cartLocationString;
    }

    cartLocations[index] = {
      location,
      direction,
      turnCount
    }
  });

  return {
    cartLocations,
    collision
  }
}

function moveCartsRemoveCollisions(map, cartLocations) {
  let collisions = [];

  _.each(cartLocations, (cart, index) => {
    if (_.includes(collisions, _.join(cart.location, ','))) {
      return true;
    }
    const location = getNextLocation(cart.location, cart.direction);
    const mapElement = map[location[1]][location[0]];
    let direction = cart.direction;
    let turnCount = cart.turnCount;
    let turnDirection;

    const cartLocationStrings = _.map(cartLocations, cart => {
      return _.join(cart.location, ',')
    });
    const cartLocationString =  _.join(location, ',');
    const crashIndex = cartLocationStrings.indexOf(cartLocationString);
    if (crashIndex > -1) {
      collisions.push(cartLocationString);
    } else if (mapElement === '+') {
      turnDirection = turningDirections[turnCount % 3];
      turnCount++;
    } else if (_.includes(['/', '\\'], mapElement)) {
      if (_.includes(['^', 'v'], direction)) {
        turnDirection = mapElement === '/' ? 'right' : 'left';
      } else {
        turnDirection = mapElement === '/' ? 'left' : 'right';
      }
    }

    if (turnDirection === 'left') {
      direction = cartPositions[(_.indexOf(cartPositions, cart.direction) + 3) % 4];
    } else if (turnDirection === 'right') {
      direction = cartPositions[(_.indexOf(cartPositions, cart.direction) + 1) % 4];
    }

    cartLocations[index] = {
      location,
      direction,
      turnCount
    };
  });

  cartLocations = _.filter(cartLocations, cart => {
    return !_.includes(collisions, _.join(cart.location, ','));
  });

  return sortCarts(cartLocations);
}

function sortCarts(cartLocations) {
  cartLocations.sort((a, b) => {
    const [ax, ay] = a.location;
    const [bx, by] = b.location;
    if (ay < by) {
      return -1;
    }
    if (ay > by) {
      return 1;
    }
    else {
      if (ax < bx) {
        return -1;
      }
      if (ax > bx) {
        return 1;
      }
    }
    return 0;
  });

  return cartLocations;
}

exports.part1 = function(rawInput) {
  let {map, cartLocations} = formatInput(rawInput);
  let collision;

  while (!collision) {
    ({cartLocations, collision} = moveCarts(map, cartLocations));
  }

  return collision;
};

exports.part2 = function(rawInput) {
  let {map, cartLocations} = formatInput(rawInput);

  while (_.size(cartLocations) > 1) {
    cartLocations = moveCartsRemoveCollisions(map, cartLocations);
  }

  return _.join(cartLocations[0].location, ',');
};
