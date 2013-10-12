SOURCE_FILES = [
  'src/core.js', 
  'src/geom.js', 
  'src/shade.js', 
  'src/scene.js',
  'src/mol.js', 
  'src/render.js', 
  'src/viewer.js'
];

ALL_FILES = new Array(SOURCE_FILES);
ALL_FILES.push('src/gl-matrix.js');
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '',
        preserveComments : false,
        report : 'min'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    },
    jshint : {
      options: { 
        multistr :true, 
        curly : true, 
        eqeqeq : true
      },
      all : SOURCE_FILES
    },

    concat: {
      dist: {
        src: ALL_FILES,
        dest: 'js/pv.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'jshint']);

};
