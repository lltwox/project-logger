var Logger = require('../lib').configure({
      colors: false,
      ns: 'message-data'
    }),
    util = require('./util');

describe('Logger', function() {

  beforeEach(function() {
    util.console.mock();
  });
  after(function() {
    util.console.restore();
  });

  it('should be able to log nothing', function() {
    var logger = Logger('nothing');

    logger.info();

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLastLogMessage('all', '');
    util.console.restore();
  });

  it('should be able to log undefined values', function() {
    var logger = Logger('undefined');

    var object = {};
    logger.info(object.property);

    util.checkLastLogMessage('all', 'undefined');
    util.console.restore();
  });

  it('should be able to log null', function() {
    var logger = Logger('null');

    logger.info(null);

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLastLogMessage('all', '');
    util.console.restore();
  });

  it('should be able to log int', function() {
    var logger = Logger('int');

    logger.info(1);

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLastLogMessage('all', '1');
    util.console.restore();
  });

  it('should be able to log string', function() {
    var logger = Logger('string');

    logger.info('string');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLastLogMessage('all', 'string');
    util.console.restore();
  });

  it('should be able to log object', function() {
    var logger = Logger('object');

    logger.info({a: {b: 'c'}});

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLastLogMessage('all', '{"a":{"b":"c"}}');
    util.console.restore();
  });

  it('should be able to log error', function() {
    var logger = Logger('error');

    logger.info(new Error('Some error'));

    util.checkLogMessageContain('all', 'Some error');
    util.console.restore();
  });

  it('should be able to log recursive objects', function() {
    var logger = Logger('recursive');

    var object = {};
    object.ref = object;
    logger.info(object);

    util.checkLoggedMessagesNumber('all', 1);

    // for different node version
    try {
      util.checkLogMessageContain('all', 'Object');
    } catch(err) {
      util.checkLogMessageContain('all', 'Circular');
    }
    util.console.restore();
  });

});