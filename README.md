project-logger
==============

`project-logger` is simple logging utility for textual application logs. It has only pre-defined message formatting and only few transports to use, so it may be enought for small projects but definetely would be a good fit for use in npm modules as a default logger if `console.log` is not enought.

##Example
```js
var Logger = require('project-logger');
var logger = new Logger();
...
logger.info('Object is now: ', obj);
logger.error(new Error('Initialization error'));
```

##Api
###Factory
`project-logger` module provides a factory and a registry for new loggers. All instances created with factory are stored in memory, so once configured logger can be used throughout the application.

####Factory.get(options)
Creates an instance of logger. `options` can be either an object, which will be passed to logger for configuration or a string, that will serve as a name, that instance will be remembered by. In case of an object, `name` option will be used to store instance.
```js
var Factory = require('project-logger').Factory;
var logger = Factory.get({name: 'example', colors: false});

// later in code
var logger = require('project-logger').get('exmaple'); // same instance as before
```
####Factory.set(name, instance)
Sets an instance for given name. Can be handy for testing.

###Class: Logger
####Logger(options)
Creates a new logger instance. `options` is an object with configuration parameters. Available options are:
```js
{
    name: 'default',     // part of formatted message, can be used to grep logs
    level: LEVEL_INFO,   // logging level
    transports: {        // list of transports to use, see below
        console: true
    },
    colors: true,        // whether to use colored output (affects only console transport)
    repeatTimeout: 1000  // time in ms, when identical messages stacked
};
```

By default loggers try to stack identical messages repeated freqently in one. So if you log same message 100 times in a row in less than a second it will show up in logs only once and then number of times it was repeated (just like syslog). If you don't like it, set `repeatTimeout` to 0.

####Logger.LEVEL_*
Constanst with appropriate log-level values, that can be used in configuration.
* Logger.LEVEL_NONE = 0
* Logger.LEVEL_ERROR = 1
* Logger.LEVEL_WARNING = 2
* Logger.LEVEL_INFO = 3
* Logger.LEVEL_DEBUG = 4

####logger.configure(options)
Configures logger after it was created. `options` have the same meaning as in constructor.

####logger.close()
Frees any used resources

####logger.error(...), logger.warning(...), logger.info(...), logger.debug(...)
Logs objects and messages with appropriate severity. Accepts any number of arguments, that will be concateneted in one message. Argument can be a string, an object or an Error instance, which will result in stack trace logged.

####logger.log(...)
Alias of `logger.info()`

###Transports
To enable transport, pass it's name in `transports` options hash.
####Console
Wrapper around `console.log()` and `console.err`. When `colors=true`, messages will be colored up, depending on their severity.
####Syslog
Logs messages to system log, using [node-syslog](https://github.com/schamane/node-syslog) package.
####File
Logs messages to file. Name of the file should be specified as a value of file key in transports hash, like that:
```js
{
    transports: {
        file: '/tmp/app.log'
    }
}
```
Transport attempts to create file and whole path to it, if not exists.

###Message format
At the moment is not configurable. Looks like this:
```
30 May 2014 13:05:11 - [cluster] - 31749 - INFO:  Worker tracking:01 disconnected
```
Where first part is date, then goes name, specified in options, then pid, severity and message itself. Should be enough, no?

##Contributing
Found a bug, have a feature proposal or want to add a pull request? All are welcome. Just go to issues and write it down.
