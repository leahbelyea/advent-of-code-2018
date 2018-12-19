const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  let pointerRegister;
  let instructions = [];

  pointerRegister = _.toNumber(_.replace(_.first(rawInput), '#ip ', ''));
  instructions = _.map(rawInput.slice(1), instruction => {
    return _.map(_.split(instruction, ' '), (value, index) => {
      return index === 0? value : _.toNumber(value);
    });
  });

  return {pointerRegister, instructions};
}

const addr = function(registers, a, b, c) {
  registers[c] = registers[a] + registers[b];
  return registers;
}

const addi = function(registers, a, b, c) {
  registers[c] = registers[a] + b;
  return registers;
}

const mulr = function(registers, a, b, c) {
  registers[c] = registers[a] * registers[b];
  return registers;
}

const muli = function(registers, a, b, c) {
  registers[c] = registers[a] * b;
  return registers;
}

const banr = function(registers, a, b, c) {
  registers[c] = registers[a] & registers[b];
  return registers;
}

const bani = function(registers, a, b, c) {
  registers[c] = registers[a] & b;
  return registers;
}

const borr = function(registers, a, b, c) {
  registers[c] = registers[a] | registers[b];
  return registers;
}

const bori = function(registers, a, b, c) {
  registers[c] = registers[a] | b;
  return registers;
}

const setr = function(registers, a, b, c) {
  registers[c] = registers[a];
  return registers;
}

const seti = function(registers, a, b, c) {
  registers[c] = a;
  return registers;
}

const gtir = function(registers, a, b, c) {
  registers[c] = a > registers[b] ? 1 : 0;
  return registers;
}

const gtri = function(registers, a, b, c) {
  registers[c] = registers[a] > b ? 1 : 0;
  return registers;
}

const gtrr = function(registers, a, b, c) {
  registers[c] = registers[a] > registers[b] ? 1 : 0;
  return registers;
}

const eqir = function(registers, a, b, c) {
  registers[c] = a === registers[b] ? 1 : 0;
  return registers;
}

const eqri = function(registers, a, b, c) {
  registers[c] = registers[a] === b ? 1 : 0;
  return registers;
}

const eqrr = function(registers, a, b, c) {
  registers[c] = registers[a] === registers[b] ? 1 : 0;
  return registers;
}

const operations = {
  addr,
  addi,
  mulr,
  muli,
  banr,
  bani,
  borr,
  bori,
  setr,
  seti,
  gtir,
  gtri,
  gtrr,
  eqir,
  eqri,
  eqrr
};

exports.part1 = function(rawInput) {
  let {pointerRegister, instructions} = formatInput(rawInput);
  let registers = [0, 0, 0, 0, 0, 0];
  let programTerminated = false;
  let pointer = 0;

  while (!programTerminated) {
    let instruction = instructions[pointer];
    let operation = operations[instruction[0]];
    let params = instruction.slice(1);

    registers[pointerRegister] = pointer;
    registers = operation(registers, ...params);
    pointer = registers[pointerRegister];
    pointer++;
    if (pointer >= _.size(instructions)) {
      programTerminated = true;
    }
  }

  return registers[0];
};

exports.part2 = function(rawInput) {
  let {pointerRegister, instructions} = formatInput(rawInput);
  let registers = [1, 0, 0, 0, 0, 0];
  let programTerminated = false;
  let pointer = 0;

  while (!programTerminated) {
    let instruction = instructions[pointer];
    let operation = operations[instruction[0]];
    let params = instruction.slice(1);
    registers[pointerRegister] = pointer;

    if (pointer === 3) {
      if (registers[5] % registers[1] === 0) {
        registers[2] = registers[5];
        registers[4] = registers[5];
      } else {
        registers[4] = registers[5];
        registers[2] = registers[1] * registers[5]
      }
    } else {
      registers = operation(registers, ...params);
    }

    pointer = registers[pointerRegister];
    pointer++;
    if (pointer >= _.size(instructions)) {
      programTerminated = true;
    }
  }

  return registers[0];
};
