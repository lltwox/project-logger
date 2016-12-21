var Logger = require('../lib').configure({colors: false}),
    util = require('./util');

describe('Logger', function() {

  var oldRepeat;
  before(function() {
    oldRepeat = Logger.config.repeat;
    Logger.configure({ns: 'repeated-messages'});
  });
  after(function() {
    Logger.configure({repeat: oldRepeat});
    util.console.restore();
  });
  beforeEach(function() {
    util.console.mock();
  });

  it('should log repeated messages', function(done) {
    Logger.configure({repeat: 5});
    var logger = Logger('repeat');

    logger.info('one');
    logger.info('one');

    logger.on('repeat', function() {
      util.checkLoggedMessagesNumber('all', 2);
      util.checkLastLogMessage(
        'all', 'Last message repeated 1 time(s)'
      );
      util.console.restore();
      done();
    });
  });

  it('should log repeated messages within timeout', function(done) {
    Logger.configure({repeat: 10});
    var logger = Logger('timeout');

    logger.info('one');
    setTimeout(function() {
      logger.info('one');
    }, 1);

    logger.once('repeat', function() {
      util.checkLoggedMessagesNumber('all', 2);
      util.checkLastLogMessage('all', 'Last message repeated 1 time(s)');
      util.console.restore();
      done();
    });
  });

  it('should log repeated messages immediately if other'
    + ' message gets logged', function(done) {

    Logger.configure({repeat: 10});
    var logger = Logger('immediate');

    logger.info('one');
    setTimeout(function() {
      logger.info('one');
      setTimeout(function() {
        logger.info('two');
      }, 1);
    }, 1);

    logger.on('repeat', function() {
      process.nextTick(function() {
        util.checkLoggedMessagesNumber('all', 3);
        util.checkLastLogMessage('all', 'two');
        util.console.restore();
        done();
      });
    });
  });

  it('should log not repeat messages with different levels', function(done) {
    Logger.configure({repeat: 5});
    var logger = Logger('levels');

    logger.info('one');
    process.nextTick(function() {
      logger.error('one');

      util.checkLoggedMessagesNumber('all', 2);
      util.checkLastLogMessage('all', 'one');
      util.console.restore();
      done();
    });
  });

  it('should not repeat messages if disabled', function() {
    Logger.configure({repeat: 0});
    var logger = Logger('disabled');

    logger.info('one');
    logger.info('one');

    util.checkLoggedMessagesNumber('all', 2);
    util.checkLastLogMessage('all', 'one');
    util.console.restore();
  });

});