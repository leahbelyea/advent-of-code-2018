const _ = require('lodash');
const assert = require('assert');
const fs = require('fs');
const day = _.padStart(process.argv[3], 2, '0');
const {inputPart1, inputPart2} = require(`./testInput/${day}.js`);
const {part1, part2} = require(`../src/${day}.js`);

describe(`Running Day ${day} Tests`, function() {
  describe('Part 1', function() {
    this.timeout(600000);
    _.each(inputPart1, ({input, expected}, index) => {
      it(`should pass with sample input ${index}`, function() {
        const answer = part1(input, true);
        assert.equal(answer, expected);
      });
    });
  });
  describe('Part 2', function() {
    this.timeout(600000);
    _.each(inputPart2, ({input, expected}, index) => {
      it(`should pass with sample input ${index}`, function() {
        const answer = part2(input, true);
        assert.equal(answer, expected);
      });
    });
  });
});
