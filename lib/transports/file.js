exports = module.exports = File;

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

/**
 * File logger
 *
 * @param {Object} config
 * @param {Object} path
 * @class File
 * @constructor
 */
function File(config, path) {
    this.config = config;
    if (typeof path != 'string') {
        throw new Error('Invalid filename, expected string');
    }

    this.path = path;
    this.stream = null;
    this.closed = false;
    this.messageQueue = [];
    this.pendingMessages = 0;

    this.initFileStream();
}
util.inherits(File, EventEmitter);

/**
 * Close all open resources
 *
 */
File.prototype.close = function() {
    this.closed = true;

    if (this.stream) {
        this.stream.end();
    }
};

/**
 * @param {String} message
 */
File.prototype.log = function(message) {
    if (!this.stream) {
        return this.messageQueue.push(message);
    }

    this.pendingMessages += 1;
    this.stream.write(message + '\n', 'utf8', this.onWriteComplete.bind(this));
};

File.prototype.initFileStream = function() {
    var initStream = function() {
        this.stream = fs.createWriteStream(this.path, {flags: 'a'});

        if (this.messageQueue.length > 0) {
            this.messageQueue.forEach(this.log.bind(this));
            this.messageQueue = [];
        }
    }.bind(this);

    mkdirp(path.dirname(this.path), function(err) {
        if (err) return this.emit('error', err);

        // touching file to make sure it exists
        fs.appendFile(this.path, '', function() {
            if (err) return this.emit('error', err);

            initStream();
        }.bind(this));
    }.bind(this));
};

File.prototype.onWriteComplete = function() {
    this.pendingMessages -= 1;
    if (!this.pendingMessages) {
        this.emit('drain');
    }
};