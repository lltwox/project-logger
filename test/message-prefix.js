var moment = require('moment'),
    Logger = require('../lib').configure({colors: false}),
    util = require('./util');

describe('Logger', function() {

  var oldSimplePrefix;
  before(function() {
    oldSimplePrefix = Logger.config['simple-prefix'];
    Logger.configure({ns: 'message-prefix'});
  });
  beforeEach(function() {
    util.console.mock();
  });
  after(function() {
    util.console.restore();
  });

  it('should add timestamp to prefix', function() {
    var logger = Logger('nothing');

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageContains('all', moment().format('YYYY'));
    util.console.restore();
  });

  it('should add name of the logger and namespace to prefix', function() {
    var logger = Logger('nothing');

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageContains('all', 'message-prefix');
    util.checkLogMessageContains('all', 'nothing');
    util.console.restore();
  });

  it('should add process id to prefix', function() {
    var logger = Logger('nothing');

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageContains('all', process.pid);
    util.console.restore();
  });

  it('should add level to prefix', function() {
    var logger = Logger('nothing');

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageContains('all', 'INFO');
    util.console.restore();
  });

  it('should not add timestamp to simple prefix', function() {
    var logger = Logger('nothing');
    logger.configure({'simple-prefix': true});

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageDoesNotContain('all', moment().format('YYYY'));

    util.console.restore();
    logger.configure({'simple-prefix': oldSimplePrefix});
  });

  it('should add name of the logger and namespace to simple prefix', function() {
    var logger = Logger('nothing');
    logger.configure({'simple-prefix': true});

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageContains('all', 'message-prefix');
    util.checkLogMessageContains('all', 'nothing');

    util.console.restore();
    logger.configure({'simple-prefix': oldSimplePrefix});
  });

  it('should not add process id to simple prefix', function() {
    var logger = Logger('nothing');
    logger.configure({'simple-prefix': true});

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageDoesNotContain('all', process.pid);

    util.console.restore();
    logger.configure({'simple-prefix': oldSimplePrefix});
  });

  it('should add error level to simple prefix', function() {
    var logger = Logger('nothing');
    logger.configure({'simple-prefix': true});

    logger.error('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageContains('all', 'ERROR');

    util.console.restore();
    logger.configure({'simple-prefix': oldSimplePrefix});
  });

  it('should not add info level to simple prefix', function() {
    var logger = Logger('nothing');
    logger.configure({'simple-prefix': true});

    logger.info('hello');

    util.checkLoggedMessagesNumber('all', 1);
    util.checkLogMessageDoesNotContain('all', 'INFO');

    util.console.restore();
    logger.configure({'simple-prefix': oldSimplePrefix});
  });

});