var debug = require('debug');

var oldConsoleLog = console.log,
    oldConsoleError = console.error,
    oldDebugLog = debug.log;

var content = '',
    logContent = '',
    errorContent = '',
    debugContent = '';

exports.console = {

  mock: function() {
    content = '';
    logContent = '';
    errorContent = '';

    console.log = function(message) {
      message += '\n';
      content += message;
      logContent += message;
    };
    console.error = function(message) {
      message += '\n';
      content += message;
      errorContent += message;
    };
  },

  restore: function() {
    console.log = oldConsoleLog;
    console.error = oldConsoleError;
  }
};

exports.debug = {

  mock: function() {
    debugContent = '';

    debug.log = function(message) {
      message += '\n';
      debugContent += message;
    };
  },

  restore: function() {
    debug.log = oldDebugLog;
  }
};

exports.checkLastLogMessage = function(type, message) {
  var content = exports.getContent(type);
  content.should.endWith(message + '\n');
};

exports.checkLoggedMessagesNumber = function(type, number) {
  var content = exports.getContent(type);
  if (!content.trim()) return Number(0).should.equal(number);
  content.trim().split('\n').length.should.equal(number);
};

exports.checkLogMessageContain = function(type, substring) {
  var content = exports.getContent(type);
  content.indexOf(substring).should.not.equal(-1);
};

exports.getContent = function(type) {
  if (type == 'log') return logContent;
  if (type == 'error') return errorContent;
  if (type == 'debug') return debugContent;

  return content;
};