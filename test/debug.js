var Logger = require('../lib').configure({
      colors: false,
      ns: 'debug'
    }),
    util = require('./util');

describe('Logger', function() {

  before(function() {
    Logger.configure({ns: ''});
  });
  beforeEach(function() {
    util.debug.mock();
  });
  afterEach(function() {
    util.debug.restore();
  });

  it('should proxy debugging to debug module', function() {
    Logger.configure({
      debug: 'debug*'
    });

    var logger1 = Logger('debug:a');
    var logger2 = Logger('debug:b');

    logger1.debug('one');
    logger2.debug('two');

    util.checkLoggedMessagesNumber('debug', 2);
  });

  it('set up debug namespaces', function() {
    Logger.configure({
      debug: 'ns:debug:a'
    });

    var logger1 = Logger('ns:debug:a');
    var logger2 = Logger('ns:debug:b');

    logger1.debug('one');
    logger2.debug('two');

    util.checkLoggedMessagesNumber('debug', 1);
  });
});
