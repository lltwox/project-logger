var Logger = require('../lib').Logger;

require('should');

describe('Console transport', function() {

    var oldConsoleLog = console.log;
    var oldConsoleError = console.error;

    var logContent;
    var errorContent;

    var mockConsole = function() {
        logContent = '';
        errorContent = '';

        console.log = function(message) {
            logContent += message;
        };
        console.error = function(message) {
            errorContent += message;
        };
    };
    var restoreConsole = function() {
        console.log = oldConsoleLog;
        console.error = oldConsoleError;
    };

    it('should log info messages via console.log', function() {
        mockConsole();

        var logger = new Logger({
            transports: {console: true},
            colors: false
        });

        try {
            logger.info('one');
            logContent.should.endWith('one');
        } catch(err) {
            restoreConsole();
            throw err;
        }

        restoreConsole();
    });

    it('should log error messages via console.error', function() {
        mockConsole();

        var logger = new Logger({
            transports: {console: true},
            colors: false
        });

        try {
            logger.error('one');
            errorContent.should.endWith('one');
        } catch(err) {
            restoreConsole();
            throw err;
        }

        restoreConsole();
    });

});