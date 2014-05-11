var Logger = require('../lib').Logger,
    testUtil = require('./test-util');

require('should');

describe('Logger', function() {

    var tempFilename;
    beforeEach(function() {
        tempFilename = testUtil.createTempFilename();
    });
    afterEach(function() {
        testUtil.removeTempFile(tempFilename);
    });

    it('should log nothing with level `none`', function() {
        var logger = new Logger({
            level: Logger.LEVEL_NONE,
            transports: {file: tempFilename}
        });

        logger.error('one');
        logger.warning('two');
        logger.info('three');
        logger.debug('four');

        logger.transports.file.messageQueue.should.eql([]);
        logger.close();
    });

    it('should log only errors with level `error`', function(done) {
        var logger = new Logger({
            level: Logger.LEVEL_ERROR,
            transports: {file: tempFilename}
        });

        logger.error('one');
        logger.warning('two');
        logger.info('three');
        logger.debug('four');

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 1);
            testUtil.checkLastLogMessage(tempFilename, 'one');
            logger.close();
            done();
        });
    });

    it('should log warnings and errors with level `warning`', function(done) {
        var logger = new Logger({
            level: Logger.LEVEL_WARNING,
            transports: {file: tempFilename}
        });

        logger.error('one');
        logger.warning('two');
        logger.info('three');
        logger.debug('four');

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 2);
            testUtil.checkLastLogMessage(tempFilename, 'two');
            logger.close();
            done();
        });
    });

    it('should log all but debug with level `info`', function(done) {
        var logger = new Logger({
            level: Logger.LEVEL_INFO,
            transports: {file: tempFilename}
        });

        logger.error('one');
        logger.warning('two');
        logger.info('three');
        logger.debug('four');

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 3);
            testUtil.checkLastLogMessage(tempFilename, 'three');
            logger.close();
            done();
        });
    });

    it('should log all with level `debug`', function(done) {
        var logger = new Logger({
            level: Logger.LEVEL_DEBUG,
            transports: {file: tempFilename}
        });

        logger.error('one');
        logger.warning('two');
        logger.info('three');
        logger.debug('four');

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 4);
            testUtil.checkLastLogMessage(tempFilename, 'four');
            logger.close();
            done();
        });
    });

});