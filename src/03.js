const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  return _.map(rawInput, claim => {
    let id, rest, xy;
    [id, rest] = _.split(claim, ' @ ');
    id = _.toNumber(_.replace(id, '#', ''));
    [xy, rest] = _.split(rest, ': ');
    const [x, y] = _.map(_.split (xy, ','), _.toNumber);
    const [width, height] = _.map(_.split(rest, 'x'), _.toNumber);

    return {id, x, y, width, height};
  });
}

function addClaimToFabric(fabric, {id, x, y, width, height}) {
  _.times(width, wIndex => {
    _.times(height, hIndex => {
      if (fabric[y+hIndex][x+wIndex] > 0) {
        fabric[y+hIndex][x+wIndex] = 'x';
      } else {
        fabric[y+hIndex][x+wIndex] = id;
      }
    });
  });

  return fabric;
}

function findNonOverlappingClaim(fabric, claims) {
  let nonOverlappingClaim;
  const fabricCounts = _.countBy(_.flatten(fabric));

  _.each(claims, ({id, width, height}) => {
    const originalSize = width * height;
    const sizeInFabric = fabricCounts[id];
    if (originalSize === sizeInFabric) {
      nonOverlappingClaim = id;
      return false;
    }
  });

  return nonOverlappingClaim;
}

exports.part1 = function(rawInput) {
  const input = formatInput(rawInput);
  const fabricWidth = 2000;
  const fabric = Array(fabricWidth).fill().map(() => Array(fabricWidth).fill(0));

  _.each(input, claim => {
    addClaimToFabric(fabric, claim);
  });

  return _.size(_.filter(_.flatten(fabric), x => x === 'x'));
};

exports.part2 = function(rawInput) {
  const input = formatInput(rawInput);
  const fabricWidth = 2000;
  const fabric = Array(fabricWidth).fill().map(() => Array(fabricWidth).fill(0));

  _.each(input, claim => {
    addClaimToFabric(fabric, claim);
  });

  const nonOverlappingClaim = findNonOverlappingClaim(fabric, input);
  return nonOverlappingClaim;
};
