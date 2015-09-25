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

  it('should be able to use given format', function(done) {
    var logger = new Logger({
      transports: {file: tempFilename},
      format: '<<{pid}>>'
    });

    logger.info();

    logger.transports.file.on('drain', function() {
      util.checkLoggedMessagesNumber(tempFilename, 1);
      util.checkLogMessageContain(tempFilename, '<<' + process.pid + '>>');
      logger.close();
      done();
    });
  });

  it('should be able to use several items in the format', function(done) {
    var logger = new Logger({
      transports: {file: tempFilename},
      format: '{pid} zzz {name}'
    });

    logger.info();

    logger.transports.file.on('drain', function() {
      util.checkLoggedMessagesNumber(tempFilename, 1);
      util.checkLogMessageContain(tempFilename, process.pid);
      util.checkLogMessageContain(tempFilename, 'default');
      logger.close();
      done();
    });
  });

});