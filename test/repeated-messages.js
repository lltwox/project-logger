var Logger = require('../lib'),
    util = require('./util');


describe('Logger', function() {

  var tempFilename;
  beforeEach(function() {
    tempFilename = util.createTempFilename();
  });
  afterEach(function() {
    util.removeTempFile(tempFilename);
  });

  it('should log repeated messages', function(done) {
    var logger = new Logger({
      repeatTimeout: 5,
      transports: {file: tempFilename}
    });

    logger.info('one');
    logger.info('one');

    logger.on('repeat', function() {
      logger.transports.file.on('drain', function() {
        util.checkLoggedMessagesNumber(tempFilename, 2);
        util.checkLastLogMessage(
          tempFilename, 'Last message repeated 1 time(s)'
        );
        logger.close();
        done();
      });
    });
  });

  it('should log repeated messages within timeout', function(done) {
    var logger = new Logger({
      repeatTimeout: 5,
      transports: {file: tempFilename}
    });

    logger.info('one');
    setTimeout(function() {
      logger.info('one');
      setTimeout(function() {
        logger.info('one');
      }, 3);
    }, 3);

    logger.once('repeat', function() {
      logger.transports.file.once('drain', function() {
        util.checkLoggedMessagesNumber(tempFilename, 2);
        util.checkLastLogMessage(
          tempFilename, 'Last message repeated 2 time(s)'
        );
        logger.close();
        done();
      });
    });
  });

  it('should log repeated messages immediately if other'
    + ' message gets logged', function(done) {

    var logger = new Logger({
      repeatTimeout: 5,
      transports: {file: tempFilename}
    });

    logger.info('one');
    setTimeout(function() {
      logger.info('one');
      setTimeout(function() {
        logger.info('two');
      }, 3);
    }, 3);

    logger.on('repeat', function() {
      logger.transports.file.once('drain', function() {
        util.checkLoggedMessagesNumber(tempFilename, 3);
        util.checkLastLogMessage(tempFilename, 'two');
        logger.close();
        done();
      });
    });
  });

  it('should log not repeat messages with different levels', function(done) {
    var logger = new Logger({
      repeatTimeout: 5,
      transports: {file: tempFilename}
    });

    logger.info('one');
    setTimeout(function() {
      logger.error('one');
    }, 3);

    var messages = 0;
    logger.transports.file.on('drain', function() {
      if (!messages) return messages += 1;

      util.checkLoggedMessagesNumber(tempFilename, 2);
      util.checkLastLogMessage(tempFilename, 'one');
      logger.close();
      done();
    });
  });

  it('should not repeat messages if disabled', function(done) {
    var logger = new Logger({
      repeatTimeout: 0,
      transports: {file: tempFilename}
    });

    logger.info('one');
    logger.error('one');

    logger.transports.file.once('drain', function() {
      util.checkLoggedMessagesNumber(tempFilename, 2);
      util.checkLastLogMessage(tempFilename, 'one');
      logger.close();
      done();
    });
  });

});