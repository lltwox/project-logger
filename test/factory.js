var LoggerFactory = require('../lib').Factory,
    util = require('./util');

describe('Looger factory', function() {

    it('should return previosly created instances', function() {
        LoggerFactory.get({
            name: 'logger',
            repeatTimeout: 10
        });

        var logger = LoggerFactory.get('logger');

        logger.config.name.should.equal('logger');
        logger.config.repeatTimeout.should.equal(10);
    });

    it('should create independent instances', function(done) {
        var file1 = util.createTempFilename();
        var file2 = util.createTempFilename();

        var logger1 = LoggerFactory.get({
            name: 'logger1',
            transports: {file: file1}
        });
        var logger2 = LoggerFactory.get({
            name: 'logger2',
            transports: {file: file2}
        });

        logger1.info('first');
        logger2.info('second');

        var drained = 0;
        var onDrain = function() {
            drained++;
            if (drained < 2) return;

            util.checkLoggedMessagesNumber(file1, 1);
            util.checkLoggedMessagesNumber(file2, 1);
            util.checkLastLogMessage(file1, 'first');
            util.checkLastLogMessage(file2, 'second');
            logger1.close();
            logger2.close();
            done();

            util.removeTempFile(file1);
            util.removeTempFile(file2);
        };

        logger1.transports.file.on('drain', onDrain);
        logger2.transports.file.on('drain', onDrain);
    });

});