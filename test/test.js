const _ = require('lodash');
const day = _.padStart(process.argv[3], 2, '0');
require(`./${day}.js`);
