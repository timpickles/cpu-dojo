var open = require('open');

module.exports = function (grunt) {
    grunt.config.init({
        mocha_phantomjs: {
            test: {
                options: {
                    'reporter': 'spec'
                }
            },
            terseTest: {
                options: {
                    'reporter': 'dot'
                }
            },
            options: {
                urls: [
                    'http://localhost:8000/test/specs/phantom/testrunner.html'
                ]
            }
        },
        connect: {
            options: {
                port: 8000,
                base: '.',
                hostname: 'localhost'
            },
            server: {
            },
            serverKeepAlive: {
                options: {
                    keepalive: true,
                    port: 9000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('open-local', function() {
        setTimeout(function() {
            open('http://localhost:9000/test/specs/phantom/testrunner.html');
        }, 250);

    });

    grunt.task.registerTask('test', [
        'connect:server',
        'mocha_phantomjs:test'
    ]);

    grunt.task.registerTask('testBrowser', [
        'open-local',
        'connect:serverKeepAlive'
    ]);

    grunt.task.registerTask('default', [
        'test'
    ]);
};
