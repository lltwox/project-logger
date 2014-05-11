var Logger = require('../lib').Logger,
    testUtil = require('./test-util');

require('should');

describe('Looger', function() {

    var tempFilename;
    beforeEach(function() {
        tempFilename = testUtil.createTempFilename();
    });
    afterEach(function() {
        testUtil.removeTempFile(tempFilename);
    });

    it('should be able to log nothing', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        logger.info();

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 1);
            testUtil.checkLastLogMessage(tempFilename, '');
            logger.close();
            done();
        });
    });

    it('should be able to log undefined values', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        var object = {};
        logger.info(object.property);

        logger.transports.file.on('drain', function() {
            testUtil.checkLastLogMessage(tempFilename, 'undefined');
            logger.close();
            done();
        });
    });

    it('should be able to log null', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        logger.info(null);

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 1);
            testUtil.checkLastLogMessage(tempFilename, '');
            logger.close();
            done();
        });
    });

    it('should be able to log int', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        logger.info(1);

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 1);
            testUtil.checkLastLogMessage(tempFilename, '1');
            logger.close();
            done();
        });
    });

    it('should be able to log string', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        logger.info('string');

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 1);
            testUtil.checkLastLogMessage(tempFilename, 'string');
            logger.close();
            done();
        });
    });

    it('should be able to log object', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        logger.info({a: {b: 'c'}});

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 1);
            testUtil.checkLastLogMessage(tempFilename, '{"a":{"b":"c"}}');
            logger.close();
            done();
        });
    });

    it('should be able to log error', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        logger.info(new Error('Some error'));

        logger.transports.file.on('drain', function() {
            testUtil.checkLogMessageContain(tempFilename, 'Some error');
            logger.close();
            done();
        });
    });

    it('should be able to log recursive objects', function(done) {
        var logger = new Logger({
            transports: {file: tempFilename}
        });

        var object = {};
        object.ref = object;
        logger.info(object);

        logger.transports.file.on('drain', function() {
            testUtil.checkLoggedMessagesNumber(tempFilename, 1);
            testUtil.checkLogMessageContain(tempFilename, 'Object');
            logger.close();
            done();
        });
    });

});