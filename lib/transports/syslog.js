exports = module.exports = Syslog;

var Logger = require('../logger');

try {
  var syslog = require('node-syslog');
} catch (err) {
  syslog = null;
}

/**
 * Syslog logger
 *
 * @param {Object} config
 * @class Syslog
 * @constructor
 */
function Syslog(config) {
  if (!syslog) return;

  syslog.init(
    config.name,
    syslog.LOG_PID | syslog.LOG_ODELAY,
    syslog.LOG_LOCAL0
  );
}

/**
 * Close all open resources
 *
 */
Syslog.prototype.close = function() {
  if (!syslog) return;

  syslog.close();
};

/**
 * @param {String} message
 * @param {Number} level
 */
Syslog.prototype.log = function(message, level) {
  if (!syslog) return;

  var syslogLevel =
    level < Logger.LEVEL_INFO ? syslog.LOG_ERR : syslog.LOG_INFO
  ;
  syslog.log(syslogLevel, message);
};
