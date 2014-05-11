var fs = require('fs'),
    os = require('os'),
    crypto = require('crypto');

require('should');

exports.createTempFilename = function() {
    return os.tmpdir() + 'logtest-'
        + crypto.randomBytes(4).readUInt32LE(0) + '.log';
};

exports.removeTempFile = function(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
};

exports.checkLastLogMessage = function(file, message) {
    var contents = fs.readFileSync(file, {encoding: 'utf8'});
    contents.should.endWith(message + '\n');
};

exports.checkLoggedMessagesNumber = function(file, number) {
    var contents = fs.readFileSync(file, {encoding: 'utf8'});
    contents.trim().split('\n').length.should.equal(number);
};

exports.checkLogMessageContain = function(file, substring) {
    var contents = fs.readFileSync(file, {encoding: 'utf8'});
    contents.indexOf(substring).should.not.equal(-1);
};