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
  if (level != 'info') this.send(level);
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

exports = module.exports = Cluster;