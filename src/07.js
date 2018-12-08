const _ = require('lodash');

exports.inputType = 'array';

function formatInput(rawInput) {
  const stepPrereqs = {};
  let stepLabels = [];

  _.each(rawInput, step => {
    const stepWords = _.words(step);
    const stepLabel = stepWords[7];
    const stepPrereq = stepWords[1];
    stepLabels.push(stepLabel);
    stepLabels.push(stepPrereq);
    if (_.has(stepPrereqs, stepLabel)) {
      stepPrereqs[stepLabel].push(stepPrereq);
    } else {
      stepPrereqs[stepLabel] = [stepPrereq];
    }
  });

  stepLabels = _.uniq(stepLabels).sort();
  return {stepPrereqs, stepLabels};
}

exports.part1 = function(rawInput) {
  let {stepPrereqs, stepLabels} = formatInput(rawInput);
  const stepsCompleted = [];
  while (_.size(stepsCompleted) < _.size(stepLabels)) {
    const availableSteps = [];
    _.each(stepLabels, label => {
      if (!_.has(stepPrereqs, label) && !_.includes(stepsCompleted, label)) {
        availableSteps.push(label);
      }
    });
    availableSteps.sort();
    const stepToDo = _.first(availableSteps);

    stepPrereqs = _.mapValues(stepPrereqs, prereqs => {
      return _.filter(prereqs, label => label !== stepToDo);
    });
    _.each(stepLabels, label => {
      if (_.has(stepPrereqs, label) && _.isEmpty(stepPrereqs[label])) {
        delete stepPrereqs[label];
      }
    });

    stepsCompleted.push(stepToDo);
  }

  return _.join(stepsCompleted, '');
};

exports.part2 = function(rawInput, isTest) {
  let {stepPrereqs, stepLabels} = formatInput(rawInput);
  const workers = isTest ? 2 : 5;
  const stepBaseTime = isTest ? 0 : 60;
  let stepsTimeLeft = {};
  const stepsCompleted = [];
  let seconds = 0;

  while (_.size(stepsCompleted) < _.size(stepLabels)) {
    // Decrement counters on steps already underway
    stepsTimeLeft = _.mapValues(stepsTimeLeft, time => time - 1);

    // Mark newly completed steps
    const nowComplete = [];
    _.each(stepsTimeLeft, (time, label) => {
      if (time === 0) {
        nowComplete.push(label);
      }
    });
    _.each(nowComplete, stepCompleted => {
      delete stepsTimeLeft[stepCompleted];

      // Update prereqs
      stepPrereqs = _.mapValues(stepPrereqs, prereqs => {
        return _.filter(prereqs, label => label !== stepCompleted);
      });
      _.each(stepLabels, label => {
        if (_.has(stepPrereqs, label) && _.isEmpty(stepPrereqs[label])) {
          delete stepPrereqs[label];
        }
      });
    });
    stepsCompleted.push(...nowComplete);

    // Process newly available steps
    const availableSteps = [];
    _.each(stepLabels, label => {
      if (!_.has(stepPrereqs, label) && !_.has(stepsTimeLeft, label) && !_.includes(stepsCompleted, label)) {
        availableSteps.push(label);
      }
    });
    availableSteps.sort();
    const availableWorkers = workers - _.size(_.keys(stepsTimeLeft));
    const stepsToDo = availableSteps.slice(0, availableWorkers);
    _.each(stepsToDo, label => {
      const timeNeeded = stepBaseTime + label.charCodeAt(0) - 64;
      stepsTimeLeft[label] = timeNeeded;
    });
    seconds++;
  }

  return seconds - 1;
};
