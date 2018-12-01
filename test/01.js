const assert = require('assert');
const _ = require('lodash');
const {part1, part2} = require(`../src/01.js`);

inputPart1 = [
  { input: ['+1', '-2', '+3', '+1'], expected: 3},
  { input: ['+1', '+1', '+1'], expected: 3},
  { input: ['+1', '+1', '-2'], expected: 0},
  { input: ['-1', '-2', '-3'], expected: -6}
];

inputPart2 = [
  { input: ['+1', '-2', '+3', '+1'], expected: 2},
  { input: ['+1', '-1'], expected: 0},
  { input: ['+3', '+3', '+4', '-2', '-4'], expected: 10},
  { input: ['-6', '+3', '+8', '+5', '-6'], expected: 5},
  { input: ['+7', '+7', '-2', '-7', '-4'], expected: 14}
];

describe('Day 1 Sample Input', function() {
  describe('Part 1', function() {
    _.each(inputPart1, ({input, expected}, index) => {
      it(`should pass with sample input ${index}`, function() {
        const answer = part1(input);
        assert.equal(answer, expected);
      });
    });
  });
  describe('Part 2', function() {
    _.each(inputPart2, ({input, expected}, index) => {
      it(`should pass with sample input ${index}`, function() {
        const answer = part2(input);
        assert.equal(answer, expected);
      });
    });
  });
});
