var Logger = require('../lib'),
    util = require('./util'),
    fs = require('fs'),
    os = require('os'),
    path = require('path');

describe('File transport', function() {

    var tempFilename;
    beforeEach(function() {
        tempFilename = util.createTempFilename();
    });
    afterEach(function() {
        util.removeTempFile(tempFilename);
    });

    it('should create file', function(done) {
        var logger = new Logger({
            transports: { file: tempFilename }
        });
        logger.info('hello');

        logger.transports.file.once('drain', function() {
            fs.existsSync(tempFilename).should.be.ok;
            logger.close();
            done();
        });
    });

    it('should create path to file', function(done) {
        var tempFilename = os.tmpdir() + '/path/logtest.log';

        var logger = new Logger({
            transports: { file: tempFilename }
        });
        logger.info('hello');

        logger.transports.file.once('drain', function() {
            fs.existsSync(tempFilename).should.be.ok;

            logger.close();
            fs.unlinkSync(tempFilename);
            fs.rmdirSync(path.dirname(tempFilename));
            done();
        });
    });

    it('should log messages to file', function(done) {
        var logger = new Logger({
            transports: { file: tempFilename }
        });
        logger.info('Hello');

        logger.transports.file.once('drain', function() {
            util.checkLastLogMessage(tempFilename, 'Hello');
            logger.close();
            done();
        });
    });

    it('should recreate file, after it was moved or renamed', function(done) {
        var logger = new Logger({
            transports: { file: tempFilename }
        });
        logger.info('one');

        logger.transports.file.once('drain', function() {
            fs.rename(tempFilename, tempFilename + '.1', function(err) {
                if (err) throw err;
                logger.info('two');
                logger.transports.file.once('drain', function() {
                    util.checkLastLogMessage(tempFilename, 'two');
                    logger.close();
                    fs.unlinkSync(tempFilename + '.1');
                    done();
                });
            });
        });
    });

    it('can share file between two loggers', function(done) {
        var firstLogger = new Logger({
            transports: { file: tempFilename }
        });
        firstLogger.log('hello');
        firstLogger.transports.file.once('drain', function() {
            var secondLogger = new Logger({
                transports: {file: tempFilename}
            });
            secondLogger.log('i am ok');
            secondLogger.transports.file.once('drain', function() {
                util.checkLoggedMessagesNumber(tempFilename, 2);
                firstLogger.close();
                secondLogger.close();
                done();
            });
        });
    });

});