
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.initConfig({
    jshint: {
      options: {
        eqeqeq: true,
        es3: true,
        latedef: true,
        newcap: true,
        nonbsp: true,
        usused: 'strict',
        expr: true,
        node: true,
        nomen: false
      },
      all: ['public/js/*.js', 'routes/*.js', '*.js']
    }
  });
};