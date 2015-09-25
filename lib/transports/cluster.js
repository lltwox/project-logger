exports = module.exports = Cluster;

var Logger = require('../logger');

/**
 * Logger transport to notify master process about all errors
 *
 * @param {Object} config
 * @class Cluster
 * @constructor
 */
function Cluster(config) {
  this.config = config;
}

/**
 * @param {String} message
 * @param {Number} level
 */
Cluster.prototype.log = function(message, level) {
  if (level == Logger.LEVEL_WARNING) {
    this.send('warning');
  } else if (level == Logger.LEVEL_ERROR) {
    this.send('error');
  }
};

/**
 * Send message to parent process
 *
 * @param {String} message
 */
Cluster.prototype.send = function(message) {
  try {
    process.send(message);
  } catch(err) {
    // chanell closed? we are shutting down probably
  }
};
