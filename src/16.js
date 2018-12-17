const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  const part2Divider = _.findIndex(rawInput, item => item === 'Part 2');
  const part1Raw = rawInput.slice(0, part2Divider);
  const part2Raw = rawInput.slice(part2Divider + 1);

  const part1 = [];
  while (!_.isEmpty(part1Raw)) {
    const [before, instruction, after] = part1Raw.splice(0, 3);
    part1.push({
      before: _.map(_.split(before.replace('Before: [', '').replace(']', ''), ', '), _.toNumber),
      instruction: _.map(_.split(instruction, ' '), _.toNumber),
      after: _.map(_.split(after.replace('After:  [', '').replace(']', ''), ', '), _.toNumber)
    });
  }

  const part2 = _.map(part2Raw, line => {
    return _.map(_.split(line, ' '), _.toNumber);
  });

  return {part1, part2};
}

addr = function (registers, a, b, c) {
  registers[c] = registers[a] + registers[b];
  return registers;
}

addi = function (registers, a, b, c) {
  registers[c] = registers[a] + b;
  return registers;
}

mulr = function (registers, a, b, c) {
  registers[c] = registers[a] * registers[b];
  return registers;
}

muli = function (registers, a, b, c) {
  registers[c] = registers[a] * b;
  return registers;
}

banr = function (registers, a, b, c) {
  registers[c] = registers[a] & registers[b];
  return registers;
}

bani = function (registers, a, b, c) {
  registers[c] = registers[a] & b;
  return registers;
}

borr = function (registers, a, b, c) {
  registers[c] = registers[a] | registers[b];
  return registers;
}

bori = function (registers, a, b, c) {
  registers[c] = registers[a] | b;
  return registers;
}

setr = function (registers, a, b, c) {
  registers[c] = registers[a];
  return registers;
}

seti = function (registers, a, b, c) {
  registers[c] = a;
  return registers;
}

gtir = function (registers, a, b, c) {
  registers[c] = a > registers[b] ? 1 : 0;
  return registers;
}

gtri = function (registers, a, b, c) {
  registers[c] = registers[a] > b ? 1 : 0;
  return registers;
}

gtrr = function (registers, a, b, c) {
  registers[c] = registers[a] > registers[b] ? 1 : 0;
  return registers;
}

eqir = function (registers, a, b, c) {
  registers[c] = a === registers[b] ? 1 : 0;
  return registers;
}

eqri = function (registers, a, b, c) {
  registers[c] = registers[a] === b ? 1 : 0;
  return registers;
}

eqrr = function (registers, a, b, c) {
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
  let {part1} = formatInput(rawInput);
  let answer = 0;

  _.each(part1, item => {
    let matches = 0;
    _.each(operations, operation => {
      const args = item.instruction.slice(1, 4);
      const after = operation([...item.before], ...args);
      if (_.join(after, ' ') === _.join(item.after, ' ')) {
        matches++;
      }
    });

    if (matches >= 3) {
      answer++;
    }
  });

  return answer;
};

exports.part2 = function(rawInput) {
  let {part1, part2} = formatInput(rawInput);
  let assigned = [];
  let operationList = Array(_.size(operations));

  _.each(part1, item => {
    let matchingOps = [];
    if (operationList[_.first(item.instruction)]) {
      return true;
    }
    _.each(operations, (operation, opName) => {
      const args = item.instruction.slice(1, 4);
      const after = operation([...item.before], ...args);
      if (_.join(after, ' ') === _.join(item.after, ' ')) {
        matchingOps.push(opName);
      }
    });

    matchingOps = _.filter(matchingOps, op => !_.includes(assigned, op));
    if (_.size(matchingOps) === 1) {
      assigned.push(_.first(matchingOps));
      const opNumber = _.first(item.instruction);
      operationList[opNumber] = _.first(matchingOps);
    }
  });


  let registers = [0, 0, 0, 0];
  _.each(part2, instruction => {
    const opName = operationList[_.first(instruction)];
    const operation = operations[opName];
    registers = operation(registers, ...instruction.slice(1, 4));
  });

  return registers[0];
};
