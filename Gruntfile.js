'use strict';

module.exports = function(grunt) {
  const TS_SRC_FILES = ['src/**/*.ts'];
  const TS_TEST_FILES = ['test/**/*.ts'];
  const ALL_TS_FILES = [...TS_SRC_FILES, ...TS_TEST_FILES];
  const ALL_FILES = [...ALL_TS_FILES, 'Gruntfile.js', 'package-lock.json', 'package.json', 'tsconfig.json', 'tslint.*'];

  grunt.initConfig({
    run: {
      testFix: {
        cmd: 'npm',
        args: ['run', 'testFix']
      },
      compile: {
        cmd: 'npm',
        args: ['run', 'prepare']
      }
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
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('test', ['run:testFix']);
  grunt.registerTask('default', ['force:test', 'watch']);
};
