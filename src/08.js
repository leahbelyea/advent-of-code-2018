const _ = require('lodash');

exports.inputType = 'string';

function formatInput(rawInput) {
  return _.map(_.split(rawInput, ' '), _.toNumber);
}

function parseNode(data, position = 0) {
  const [numChildren, numMetadata] = data.slice(position, position + 2);
  const noChildren = numChildren === 0;
  const validPositions = !_.isObject(numChildren) && !_.isObject(numMetadata);
  const childrenProcessed = areChildrenProcessed(data, position);

  if (validPositions && (noChildren || childrenProcessed)) {
    data.splice(position, 2);
    const children = data.splice(position, numChildren);
    const metadata = data.splice(position, numMetadata);
    let metadataSum = _.sumBy(children, 'metadataSum') + _.sum(metadata);
    let value = 0;
    _.each(metadata, mIndex => {
      value += _.get(children[mIndex - 1], 'value', 0);
    });
    if (noChildren) {
      value = metadataSum;
    }
    const node = {numChildren, numMetadata, children, metadata, metadataSum, value};
    data.splice(position, 0, node);
    return data;
  } else {
    const nextPosition = getNextValidPosition(data, position);
    return parseNode(data, nextPosition);
  }
}

function areChildrenProcessed(data, position = 0) {
  const [numChildren, numMetadata] = data.slice(position, position + 2);
  let processed = true;

  _.times(numChildren, index => {
    if (!_.isObject(data[position + 2 +index])) {
      processed = false;
    }
  });

  return processed;
}

function getNextValidPosition(data, position) {
  let validPosition = position + 2;
  while (_.isObject(data[validPosition]) || _.isObject(data[validPosition + 1])) {
    validPosition++;
    if (validPosition >= _.size(data)) {
      validPosition = null;
      break;
    }
  }
  return validPosition;
}

exports.part1 = function(rawInput) {
  let input = formatInput(rawInput);
  while (!_.isObject(_.first(input))) {
    input = parseNode(input);
  }
  return _.first(input).metadataSum;
};

exports.part2 = function(rawInput, isTest) {
  let input = formatInput(rawInput);
  while (!_.isObject(_.first(input))) {
    input = parseNode(input);
  }
  return _.first(input).value;
};
