project-logger
==============

`project-logger` is simple logging utility for textual application logs. It has simple log-flooding protection, ability to send messages about errors to master process in the cluster and proxy to `debug` module.

##Example
```js
var logger = require('project-logger')('test');

logger.info('Object is now: ', obj);
// 24 Feb 2016 16:40:14 - [server] - 24010 - INFO:  Object is now:   {"hello":"world"}

logger.error(new Error('Initialization error'));
// 24 Feb 2016 16:40:14 - [server] - 24010 - ERROR:  Error: Initialization error
//  at Object.<anonymous> (../example.js:3:14)
//  ...
```

##How to use
###Configuration
All loggers share same configuration. It can be set on factory-method. All options with defaults explained below.
```js
// values below are default ones
var Logger = require('project-logger').configure({
  ns: undefined,   // prefix for all logger names
  level: 'info',   // log level, can be 'error', 'warning' and 'info'
  console: true,   // whether to send messages to console
  cluster: false,  // whether to send messages to master process
  colors: true,    // whether console output should be colored,
  debug:           // namespaces to enable for debug, see https://www.npmjs.com/package/debug for more info, usual DEBUG env variable works as well
  repeat: 1000     // time in ms, when identical messages stacked
});
```

By default loggers try to stack identical messages repeated freqently in one. So if you log same message 100 times in a row in less than a second it will show up in logs only once and then number of times it was repeated (just like syslog). If you don't like it, set `repeat` to 0.

####logger.error(...), logger.warning(...), logger.info(...)
Logs objects and messages with appropriate level. Accepts any number of arguments, that will be concateneted in one message. Argument can be a string, an object or an Error instance, which will result in stack trace logged.

####logger.debug(...) 
Logs debug message with `debug` module

##Contributing
Found a bug, have a feature proposal or want to add a pull request? All are welcome. Just go to issues and write it down.
