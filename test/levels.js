var Logger = require('../lib').configure({
      colors: false
    }),
    util = require('./util');

describe('Logger', function() {

  var oldLevel;
  before(function() {
    Logger.configure({ns: 'levels'});
    oldLevel = Logger.config.level;
  });
  after(function() {
    util.console.restore();
    Logger.configure({level: oldLevel});
  });
  beforeEach(function() {
    util.console.mock();
  });

  it('should log only errors with level `error`', function() {
    Logger.configure({level: 'error'});
    var logger = Logger('error');

    logger.error('one');
    logger.warning('two');
    logger.info('three');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLastLogMessage('all', 'one');
    util.console.restore();
  });

  it('should log warnings and errors with level `warning`', function() {
    Logger.configure({level: 'warning'});
    var logger = Logger('warning');

    logger.error('one');
    logger.warning('two');
    logger.info('three');

    util.checkLoggedMessagesNumber('all', 2);
    util.checkLastLogMessage('all', 'two');
    util.console.restore();
  });

  it('should log all but debug with level `info`', function() {
    Logger.configure({level: 'info'});
    var logger = Logger('info');

    logger.error('one');
    logger.warning('two');
    logger.info('three');

    util.checkLoggedMessagesNumber('all', 3);
    util.checkLastLogMessage('all', 'three');
    util.console.restore();
  });

  it('should not log anything with invalid level', function() {
    Logger.configure({level: 'surprise-me'});
    var logger = Logger('invalid');

    logger.error('one');
    logger.warning('two');
    logger.info('three');

    util.checkLoggedMessagesNumber('all', 0);
    util.console.restore();
  });
});
