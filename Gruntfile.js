'use strict';

module.exports = function(grunt) {
  const TS_SRC_FILES = ['src/**/*.ts'];
  const TS_TEST_FILES = ['test/**/*.ts'];
  const ALL_TS_FILES = [...TS_SRC_FILES, ...TS_TEST_FILES];
  const ALL_FILES = [...ALL_TS_FILES, 'Gruntfile.js', 'package-lock.json', 'package.json', 'tsconfig.json', 'tslint.*'];

  // Project configuration.
  grunt.initConfig({
    run: {
      test: {
        cmd: 'npm',
        args: ['run', 'test']
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
<<<<<<< HEAD
  grunt.loadNpmTasks('grunt-prettier');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('test', ['run:test']);
=======
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-force-task');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('test', [ 'run:compile', 'run:test', 'tslint:src', 'tslint:test']);
>>>>>>> origin/master
  grunt.registerTask('default', ['force:test', 'watch']);
};
