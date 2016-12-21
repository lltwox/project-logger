var Logger = require('../lib');

describe('Logger', function() {

  var oldRepeat;
  before(function() {
    oldRepeat = Logger.config.repeat;
  });
  after(function() {
    Logger.configure({repeat: oldRepeat});
  });

  it('should proxy configuration from instance to global', function() {
    var logger = Logger('config:proxy');
    logger.configure({
      repeat: 10
    });

    Logger.config.repeat.should.equal(10);
  });

});
