const _ = require('lodash');
const day = _.padStart(process.argv[2], 2, '0');
const {part1, part2, inputType} = require(`./src/${day}.js`);
const {getInputArray, getInputString} = require('./src/helpers');

const rawInput = inputType === 'string' ?
  getInputString(`${day}.txt`) :
  getInputArray(`${day}.txt`);

console.log(`######## Advent of Code Day ${day} ########\n`);
if (part1) {
  console.log('# Part 1 #');
  console.log(part1(rawInput));
}

if (part2) {
  console.log('\n# Part 2 #');
  console.log(part2(rawInput));
}
