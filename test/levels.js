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
      util.checkLoggedMessagesNumber(tempFilename, 1);
      util.checkLastLogMessage(tempFilename, 'one');
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
      util.checkLoggedMessagesNumber(tempFilename, 2);
      util.checkLastLogMessage(tempFilename, 'two');
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
      util.checkLoggedMessagesNumber(tempFilename, 3);
      util.checkLastLogMessage(tempFilename, 'three');
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
      util.checkLoggedMessagesNumber(tempFilename, 4);
      util.checkLastLogMessage(tempFilename, 'four');
      logger.close();
      done();
    });
  });

});