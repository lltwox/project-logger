var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    moment = require('moment'),
    debug = require('debug'),
    colors = require('colors'),

    ConsoleLogger = require('./logger/console'),
    ClusterLogger = require('./logger/cluster');

/**
 * Logger class.
 *
 * @param {Object} config
 * @class Logger
 * @constructor
 */
function Logger(name, global) {
  this.config = {};
  this.name = name;
  this.global = global;

  this.lastMessage = null;
  this.lastLevel = null;
  this.repeated = 0;
  this.repeatTimer = null;
}
util.inherits(Logger, EventEmitter);

/**
 * Configure logger
 *
 * @param {Object} config
 */
Logger.prototype.configure = function(config) {
  this.global.configure(config);
};

/**
 * Different methods for different log levels
 *
 * @param {String|Object|Error} ...data
 */
Logger.prototype.error = function() {
  return this.log('error', arguments);
};
Logger.prototype.warning = function() {
  return this.log('warning', arguments);
};
Logger.prototype.info = function() {
  return this.log('info', arguments);
};

/**
 * Write debug message
 *
 * @param {String|Object|Error} ...data
 */
Logger.prototype.debug = function() {
  var message = this.formatItems(arguments);
  if (this.getConfig('colors')) message = colors.gray(message);
  this.getDebugLogger()(message);
};

/**
 * @param {String} key
 * @return {String}
 * @private
 */
Logger.prototype.getConfig = function(key) {
  return this.global.config[key];
};

/**
 * @param {Number} level
 * @param {Array} items
 * @private
 */
Logger.prototype.log = function(level, items) {
  if (this.isDisabled(level)) return;

  var message = this.getMessagePrefix(level) + this.formatItems(items);

  if (this.isRepeat(level, message)) return this.scheduleRepeat();
  this.doRepeat();
  this.updateRepeatMessage(level, message);

  this.pushToLoggers(level, message);
};

/**
 * @return {Boolean}
 */
Logger.prototype.isDisabled = function(level) {
  var currentLevel = this.getConfig('level');
  return (
    this.global.levels.indexOf(level.toLowerCase()) >
    this.global.levels.indexOf(currentLevel.toLowerCase())
  );
};

/**
 * @param  {String} level
 * @return {String}
 * @private
 */
Logger.prototype.getMessagePrefix = function(level) {
  return util.format(
    '%s - [%s] - %d - %s:  ',
    moment().format('DD MMM YYYY HH:mm:ss'), this.getName(),
    process.pid, level.toUpperCase()
  );
};

/**
 * @return {String}
 */
Logger.prototype.getName = function() {
  if (!this.nsName) {
    var ns = this.getConfig('ns');
    if (ns) {
      this.nsName = ns + (this.name ? ':' + this.name : '');
    } else {
      this.nsName = this.name || 'default';
    }
  }

  return this.nsName;
};

/**
 * @param {Array} items
 * @return {String}
 * @private
 */
Logger.prototype.formatItems = function(items) {
  var args = Array.prototype.slice.call(items, 0);
  return args.reduce(function(message, item) {
    if (item === undefined) {
      return message + ' undefined';
    } else if (item === null) {
      return message + ' null';
    } else if (typeof item == 'string' || typeof item == 'number') {
      return message + ' ' + item;
    } else if (item.stack || item.message) {
      return message + ' ' + (item.stack || item.message);
    } else {
      try {
        return message + ' ' + util.format('%j', item);
      } catch(err) {
        return message + ' Object';
      }
    }
  }, '').trim();
};

/**
 * @param  {Number} level
 * @param  {String} message
 * @return {Boolean}
 */
Logger.prototype.isRepeat = function(level, message) {
  return this.getConfig('repeat')
    && this.lastLevel == level && this.lastMessage == message;
};

/**
 * Schedule repeat message to be logged
 *
 */
Logger.prototype.scheduleRepeat = function() {
  this.repeated += 1;
  if (this.repeatTimer) clearTimeout(this.repeatTimer);

  this.repeatTimer = setTimeout(
    this.doRepeat.bind(this), this.config.repeatTimeout
  );
};

/**
 * Cancel timer and log repeat message immedialty, if needed
 *
 */
Logger.prototype.doRepeat = function() {
  if (!this.repeatTimer) return;

  clearTimeout(this.repeatTimer);
  this.repeatTimer = null;

  this.logRepeatMessage();
  this.emit('repeat', this.lastMessage, this.repeated);

  this.lastMessage = null;
  this.lastLevel = null;
  this.repeated = 0;
};

/**
 * @param {Number} level
 * @param {String} message
 */
Logger.prototype.updateRepeatMessage = function(level, message) {
  this.lastLevel = level;
  this.lastMessage = message;
};

/**
 * Log message about repeated messages
 */
Logger.prototype.logRepeatMessage = function() {
  this.log(
    this.lastLevel,
    ['Last message repeated ' + this.repeated + ' time(s)']
  );
};

/**
 * @param  {Number} level
 * @param  {String} message
 */
Logger.prototype.pushToLoggers = function(level, message) {
  if (this.getConfig('console')) this.getConsoleLogger().log(level, message);
  if (this.getConfig('cluster')) this.getClusterLogger().log(level, message);
};

/**
 * @return {ConsoleLogger}
 * @private
 */
Logger.prototype.getConsoleLogger = function() {
  if (!this.consoleLogger) {
    this.consoleLogger = new ConsoleLogger(this.getConfig('colors'));
  }

  return this.consoleLogger;
};

/**
 * @return {ClusterLogger}
 * @private
 */
Logger.prototype.getClusterLogger = function() {
  if (!this.clusterLogger) {
    this.clusterLogger = new ClusterLogger();
  }

  return this.clusterLogger;
};

/**
 * @return {debug}
 * @private
 */
Logger.prototype.getDebugLogger = function() {
  if (!this.debugLogger) {
    if (this.getConfig('colors')) process.env.DEBUG_COLORS = 'true';
    this.debugLogger = debug(this.getName());
  }

  return this.debugLogger;
};

exports = module.exports = Logger;
