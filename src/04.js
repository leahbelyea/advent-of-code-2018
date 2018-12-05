const _ = require('lodash');
const moment = require('moment');

exports.inputType = 'array';

function sortEntries(entries) {
  entries.sort((a, b) => {
    let [timestampA, restA] = _.split(a, '] ');
    timestampA = _.replace(timestampA, '[', '');
    let [timestampB, restB] = _.split(b, '] ');
    timestampB = _.replace(timestampB, '[', '');

    if (timestampA < timestampB) {
      return -1;
    }
    if (timestampA > timestampB) {
      return 1;
    }
    return 0;
  });

  return entries;
}

function formatInput(rawInput) {
  const entries = sortEntries(rawInput);

  let id;
  return _.map(entries, logEntry => {
    let [time, event] = _.split(logEntry, '] ');
    time = moment(_.replace(time, '[', ''), 'YYYY-MM-DD HH:mm');

    let action = event;
    if (_.startsWith(event, 'Guard')) {
      id = _.words(event)[1];
      action = 'starts shift';
    }

    return {time, id, action}
  });
}

function getSleepTime(guard, logEntries) {
  sleepTime = 0;

  _.each(logEntries, (logEntry, index) => {
    if (logEntry.action === 'falls asleep' && logEntry.id === guard) {
      const time = logEntry.time;
      const endTime = index >= _.size(logEntries) ? null : logEntries[index + 1].time;
      const duration = endTime.diff(time, 'minutes');
      sleepTime += duration;
    }
  });

  return sleepTime;
}

function getSleepiestMinute(guard, logEntries) {
  const minutes = {};

  _.each(logEntries, (logEntry, index) => {
    if (logEntry.action === 'falls asleep' && logEntry.id === guard) {
      const time = logEntry.time;
      const endTime = index >= _.size(logEntries) ? null : logEntries[index + 1].time;

      while (time < endTime) {
        const minute = time.minutes();
        if (_.has(minutes, minute)) {
          minutes[minute] += 1;
        } else {
          minutes[minute] = 1;
        }
        time.add(1, 'm');
      }
    }
  });

  const sleepiestMinute = _.maxBy(_.keys(minutes), minute => minutes[minute])

  return {
    minute: sleepiestMinute,
    times: minutes[sleepiestMinute]
  }
}

exports.part1 = function(rawInput) {
  const input = formatInput(rawInput);
  const guards = _.keys(_.keyBy(input, 'id'));

  let mostSleep = 0;
  let sleepiestGuard;
  _.each(guards, guard => {
    const sleepTime = getSleepTime(guard, input);
    if (sleepTime > mostSleep) {
      mostSleep = sleepTime;
      sleepiestGuard = guard;
    }
  });

  const sleepiestMinute = getSleepiestMinute(sleepiestGuard, input).minute;
  return _.toNumber(sleepiestGuard) * _.toNumber(sleepiestMinute);
};

exports.part2 = function(rawInput) {
  const input = formatInput(rawInput);
  const guards = _.keys(_.keyBy(input, 'id'));

  let mostSleepTimes = 0;
  let sleepiestGuard;
  let sleepiestMinute;
  _.each(guards, guard => {
    const {minute, times} = getSleepiestMinute(guard, input);
    if (times > mostSleepTimes) {
      mostSleepTimes = times;
      sleepiestGuard = guard;
      sleepiestMinute = minute;
    }
  });

  return _.toNumber(sleepiestGuard) * _.toNumber(sleepiestMinute);
};
