var Logger = require('./logger');

/**
 * List of created instances, using factory
 *
 * @type {Object}
 */
var instances = {};

/**
 * Get logger instance from loggers collection.
 *
 * Loggers with the same name configured only once, all following calls to get
 * will result in the previous instance. To change configuration,
 * Logger.configure method should be called on instance.
 *
 * @param {Object} config
 * @returns {Logger}
 */
exports.get = function(config) {
  var name;
  if (typeof config == 'string') {
    name = config;
    config = {name: name};
  } else {
    name = config.name || 'default';
    config = config || {};
  }

  if (!instances[name]) {
    instances[name] = new Logger(config);
  }

  return instances[name];
};

/**
 * Set logger instance.
 * Intended to simplify testing of modules, dependent on logger
 *
 * @param {String} name
 * @param {Object} object
 */
exports.set = function(name, object) {
  if (!name || typeof name != 'string' || !object) {
    throw new Error('Invalid name or logger');
  }

  instances[name] = object;
};

exports.Logger = Logger;
