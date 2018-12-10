const _ = require('lodash');

exports.inputType = 'string';

exports.part1 = function(rawInput) {
  const [players,,,,,, lastMarble] = _.map(_.words(rawInput), _.toNumber);
  const circle = [0];
  const scores = _.fill(Array(players), 0);
  let currentMarblePos = 0;
  let nextMarbleScore = 1;
  let nextPlayer = 1;

  while (nextMarbleScore <= lastMarble) {
    if ((nextMarbleScore % 23) === 0) {
      const marbleRemovePosition = (currentMarblePos + _.size(circle) - 7) % _.size(circle);
      const score = nextMarbleScore + circle.splice(marbleRemovePosition, 1)[0];
      scores[nextPlayer] += score;
      currentMarblePos = marbleRemovePosition % _.size(circle);
    } else {
      const marblePosition = (currentMarblePos + 2) % _.size(circle);
      circle.splice(marblePosition, 0, nextMarbleScore);
      currentMarblePos = marblePosition;
    }

    nextMarbleScore++;
    nextPlayer = (nextPlayer + 1) % players;
  }

  return _.max(scores);
};

exports.part2 = function(rawInput, isTest) {
  const [players,,,,,, lastMarble] = _.map(_.words(rawInput), _.toNumber);
  const circleStart = {
    value: 0,
    prev: null,
    next: null
  };
  circleStart.next = circleStart;
  circleStart.prev = circleStart;

  const scores = _.fill(Array(players), 0);
  let currentMarble = circleStart;
  let nextMarbleScore = 1;
  let nextPlayer = 1;

  while (nextMarbleScore <= lastMarble * 100) {
    if ((nextMarbleScore % 23) === 0) {
      _.times(7, () => {
        currentMarble = currentMarble.prev;
      });
      const score = nextMarbleScore + currentMarble.value;
      scores[nextPlayer] += score;
      const next = currentMarble.next;
      const prev = currentMarble.prev;
      prev.next = next;
      next.prev = prev;
      currentMarble = next;
    } else {
      currentMarble = currentMarble.next;
      const prev = currentMarble;
      const next = currentMarble.next;
      const node = {
        value: nextMarbleScore,
        prev,
        next
      }
      prev.next = node;
      next.prev = node;
      currentMarble = node;
    }

    nextMarbleScore++;
    nextPlayer = (nextPlayer + 1) % players;
  }

  return _.max(scores);
};
