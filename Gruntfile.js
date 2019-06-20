'use strict';

module.exports = function(grunt) {
  const TS_SRC_FILES = ['src/**/*.ts'];
  const TS_TEST_FILES = ['test/**/*.ts'];
  const ALL_TS_FILES = [...TS_SRC_FILES, ...TS_TEST_FILES];
  const COMPILED_SRC_FILES = ['dist/**/*.js'];
  const COMPILED_TEST_FILES = ['dist/test/**/*.test.js'];
  const ALL_FILES = [...ALL_TS_FILES, 'Gruntfile.js', 'package-lock.json', 'package.json', 'tsconfig.json', 'tslint.*'];

  // Project configuration.
  grunt.initConfig({
    run: {
      test: {
        cmd: 'npm',
        args: ['run', 'testCode']
      },
      compile: {
        cmd: 'npm',
        args: ['run', 'prepare']
      }
    },

    tslint: {
      test: {
        options: {
          configuration: 'tslint.test.js',
          fix: true
        },
        files: {
          src: TS_TEST_FILES,
        },
      },
      src: {
        options: {
          configuration: 'tslint.js',
          fix: true
        },
        files: {
          src: TS_SRC_FILES,
        },
      },
    },

    watch: {
      compile: {
        files: ALL_FILES,
        tasks: [ 'test'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-prettier');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('test', [ 'run:compile', 'run:test', 'prettier', 'tslint:src', 'tslint:test']);
  grunt.registerTask('default', ['force:test', 'watch']);
};
