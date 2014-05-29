var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    moment = require('moment'),
    _ = require('lodash');

exports = module.exports = Logger;
exports.LEVEL_NONE = 0;
exports.LEVEL_ERROR = 1;
exports.LEVEL_WARNING = 2;
exports.LEVEL_INFO = 3;
exports.LEVEL_DEBUG = 4;

/**
 * Map of level to message part, representing it
 *
 * @type {Object}
 */
var LEVEL_MESSAGES = {};
LEVEL_MESSAGES[exports.LEVEL_ERROR] = 'ERROR';
LEVEL_MESSAGES[exports.LEVEL_WARNING] = 'WARNING';
LEVEL_MESSAGES[exports.LEVEL_INFO] = 'INFO';
LEVEL_MESSAGES[exports.LEVEL_DEBUG] = 'DEBUG';

/**
 * Options, that logger gets by default
 *
 * @type {Object}
 */
var DEFAULT_OPTIONS = {
    name: 'default',
    level: exports.LEVEL_INFO,
    transports: {
        console: true
    },
    colors: true,
    repeatTimeout: 1000
};

/**
 * List of available transports
 *
 * @type {Object}
 */
var Loggers = {
    console: require('./transports/console'),
    syslog: require('./transports/syslog'),
    file: require('./transports/file')
};

/**
 * Logger class, can write to syslog or console.
 *
 * @param {String} name
 * @class Logger
 * @constructor
 */
function Logger(config) {
    this.config = {};

    this.lastMessage = null;
    this.lastLevel = null;
    this.repeated = 0;
    this.repeatTimer = null;

    this.transports = {};

    this.configure(_.defaults(config || {}, DEFAULT_OPTIONS));
}
util.inherits(Logger, EventEmitter);

/**
 * Configure logger instance
 *
 * @param {Object} config
 */
Logger.prototype.configure = function(config) {
    for (var option in config) {
        this.config[option] = config[option];
    }

    this.close();
    this.transports = {};
    Object.keys(this.config.transports).forEach(function(type) {
        if (!this.config.transports[type] || !Loggers[type]) return;
        this.transports[type] = new Loggers[type](
            this.config, this.config.transports[type]
        );
    }.bind(this));
};

/**
 * Close logger
 *
 */
Logger.prototype.close = function() {
    Object.keys(this.transports).forEach(function(type) {
        if (this.transports[type].close) this.transports[type].close();
    }.bind(this));
};

/**
 * Write error message
 *
 * @param {String|Object|Error} ...data
 */
Logger.prototype.error = function() {
    if (this.config.level >= exports.LEVEL_ERROR) {
        this.logDown(arguments, exports.LEVEL_ERROR);
    }
};

/**
 * Write warning message
 *
 * @param {String|Object|Error} ...data
 */
Logger.prototype.warning = function() {
    if (this.config.level >= exports.LEVEL_WARNING) {
        this.logDown(arguments, exports.LEVEL_WARNING);
    }
};

/**
 * Write notice message
 *
 * @param {String|Object|Error} ...data
 */
Logger.prototype.info = function() {
    if (this.config.level >= exports.LEVEL_INFO) {
        this.logDown(arguments, exports.LEVEL_INFO);
    }
};

/**
 * Write debug message
 *
 * @param {String|Object|Error} ...data
 */
Logger.prototype.debug = function() {
    if (this.config.level >= exports.LEVEL_DEBUG) {
        this.logDown(arguments, exports.LEVEL_DEBUG);
    }
};

/**
 * Alias for mostly used method
 *
 * @type {Function}
 */
Logger.prototype.log = Logger.prototype.info;

/**
 * @param {Array} items
 * @param {Number} level
 * @private
 */
Logger.prototype.logDown = function(items, level) {
    var message = this.getMessagePrefix(level) + this.formatItems(items);

    if (this.isRepeat(message, level)) return this.scheduleRepeat();
    this.doRepeat();
    this.updateRepeatMessage(message, level);

    this.pushToLoggers(message, level);
};

/**
 * @param  {Number} level
 * @return {String}
 */
Logger.prototype.getMessagePrefix = function(level) {
    return util.format(
        '%s - [%s] - %d - %s:  ',
        moment().format('DD MMM YYYY HH:mm:ss'), this.config.name,
        process.pid, LEVEL_MESSAGES[level]
    );
};

/**
 * @param {Array} items
 * @return {String}
 */
Logger.prototype.formatItems = function(items) {
    var args = Array.prototype.slice.call(items, 0);
    return args.reduce(function(message, item) {
        if (!item) {
            return message + '  undefined';
        } else if (typeof item == 'string') {
            return message + '  ' + item;
        } else if (item.stack || item.message) {
            return message + '  ' + (item.stack || item.message);
        } else {
            try {
                return message + '  ' + util.format('%j', item);
            } catch(err) {
                return message + '  Object';
            }
        }
    }, '').trim();
};

/**
 * @param  {String} message
 * @param  {Number} level
 * @return {Boolean}
 */
Logger.prototype.isRepeat = function(message, level) {
    return this.config.repeatTimeout
        && this.lastMessage == message && this.lastLevel == level;
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
 * Cancel timer and log repeat message immedialty, of needed
 *
 */
Logger.prototype.doRepeat = function() {
    if (!this.repeatTimer) return;

    clearTimeout(this.repeatTimer);
    this.repeatTimer = null;

    this.emit('repeat', this.lastMessage, this.repeated);
    this.logRepeatMessage();

    this.lastMessage = null;
    this.lastLevel = null;
    this.repeated = 0;
};

/**
 * @param {String} message
 * @param {Number} level
 */
Logger.prototype.updateRepeatMessage = function(message, level) {
    this.lastMessage = message;
    this.lastLevel = level;
};

/**
 * Log message about repeated messages
 */
Logger.prototype.logRepeatMessage = function() {
    this.logDown(
        ['Last message repeated ' + this.repeated + ' time(s)'],
        this.lastLevel
    );
};

/**
 * @param  {String} message
 * @param  {Number} level
 */
Logger.prototype.pushToLoggers = function(message, level) {
    for (var type in this.transports) {
        try {
            this.transports[type].log(message, level);
        } catch (err) {
            // error while logging, trying to log it can fail everything
        }
    }
};
