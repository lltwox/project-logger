var colors = require('colors');

/**
 * Map of level to color, that it should have in console
 *
 * @type {Object}
 */
var LEVEL_COLORS = {
  'error': colors.red,
  'warning': colors.yellow,
  'info': colors.white
};

/**
 * Console logger
 *
 * @param {Boolean} colors
 * @constructor
 */
function Console(colors) {
  this.colors = colors;
}

/**
 * @param {String} message
 * @param {Number} level
 */
Console.prototype.log = function(level, message) {
  if (this.colors) message = LEVEL_COLORS[level].call(colors, message);

  if (level != 'info') {
    console.error(message);
  } else {
    console.log(message);
  }
};

/**
 * @param {String} message
 * @param {Boolean} symbolsToClear
 */
Console.prototype.stdout = function(message, symbolsToClear) {
  if (symbolsToClear && process.stdout.isTTY) {
    while (symbolsToClear > process.stdout.columns) {
      process.stdout.clearLine();
      process.stdout.moveCursor(0, -1);
      symbolsToClear -= process.stdout.columns;
    }

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  process.stdout.write(message);
};

exports = module.exports = Console;