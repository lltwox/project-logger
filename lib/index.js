var debug = require('debug'),
    Logger = require('./logger');

/**
 * Factory for all new loggers
 *
 * @param {String} name
 * @return {Logger}
 */
module.exports = function(name) {
  return new Logger(name, module.exports);
};

/**
 * Possible levels
 *
 * @type {Array}
 */
module.exports.levels = ['error', 'warning', 'info'];

/**
 * Set global config for all instances
 *
 * @param {Object} config
 * @return {Function} - factory function
 */
module.exports.configure = function(config) {
  if (!config) return this;
  for (var option in config) {
    this.config[option] = config[option];
  }
  if (this.config.debug) debug.enable(this.config.debug);

  return this;
};

// setting up default values
module.exports.config = {};
module.exports.configure({
  level: 'info',
  console: true,
  cluster: false,
  colors: true,
  repeat: 1000
});

module.exports.Logger = Logger;