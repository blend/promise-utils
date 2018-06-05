'use strict';

module.exports = function(grunt) {
  const TS_SRC_FILES = ['src/**/*.ts'];
  const TS_TEST_FILES = ['test/**/*.ts'];
  const ALL_TS_FILES = [...TS_SRC_FILES, ...TS_TEST_FILES];
  const COMPILED_SRC_FILES = ['dist/**/*.js'];
  const COMPILED_TEST_FILES = ['dist/test/**/*.test.js'];

  // Project configuration.
  grunt.initConfig({

    ts: {
      default: {
        tsconfig: true
      }
    },

    ava: {
      test: {
        options: {
          nyc: true,
        },
        files: {
          src: COMPILED_TEST_FILES,
        },
      },
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
        files: ALL_TS_FILES,
        tasks: [ 'ts', 'ava', 'tslint:src', 'tslint:test'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-ava');

  grunt.registerTask('default', ['force:ts', 'watch']);
};
