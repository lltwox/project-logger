exports = module.exports = Console;

var colors = require('colors'),
    Logger = require('../logger');

/**
 * Map of level to color, that it should have in console
 *
 * @type {Object}
 */
var LEVEL_COLORS = {};
LEVEL_COLORS[Logger.LEVEL_ERROR] = colors.red;
LEVEL_COLORS[Logger.LEVEL_WARNING] = colors.yellow;
LEVEL_COLORS[Logger.LEVEL_INFO] = colors.white;
LEVEL_COLORS[Logger.LEVEL_DEBUG] = colors.grey;

/**
 * Console logger
 *
 * @param {Object} config
 * @class Console
 * @constructor
 */
function Console(config) {
    this.config = config;
}

/**
 * @param {String} message
 * @param {Number} level
 */
Console.prototype.log = function(message, level) {
    if (this.config.colors) {
        message = LEVEL_COLORS[level].call(colors, message);
    }

    if (level < Logger.LEVEL_INFO) {
        console.error(message);
    } else {
        console.log(message);
    }
};
