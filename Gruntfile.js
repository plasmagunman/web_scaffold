// FEATURES:
//  - cp html
//  - concat css
//  - concat js
//  - compile less
//  - bower components: .js and .css
//  - clean
//  - express / livereload
//
// TODO:
//  - cp other assets
//  - deploy
//  - config (don't hardcode file paths)
//  - add target support (http://gruntjs.com/api/grunt.option)


module.exports = function (grunt) {
  grunt.initConfig({

    target_dir: './dist/',

    clean: [
      '<%= target_dir %>',
      'bower_components/',
    ],

    copy: {
      // copy content of src/html, including subdirectories
      html: {
        files: [
          {
            expand: true,
            cwd: './src/html/',
            src: '**',
            dest: '<%= target_dir %>',
          },
        ],
      },
    },

    concat: {
      // concat css files alphabetically
      css: {
        src: [ './src/css/**/*.css', ],
        dest: '<%= target_dir %>' + '/css/main.css',
      },
      // concat js files alphabetically
      js: {
        src: [ './src/js/**/*.js', ],
        dest: '<%= target_dir %>' + '/js/main.js',
        options: {
          banner: '!function () { "use strict";\n',
          footer: '}();',
        },
      },
    },

    // compile less, input files are read alphabetically
    less: {
      options: {
        strictUnits: true,
      },
      default: {
        files: [{
          src: './src/less/**/*.less',
          dest: '<%= target_dir %>' + '/css/less.css',
        }],
      },
    },

    bowerful: {
      dist: {
        packages: {
          jquery: '2.1.x',
          'normalize-css': '3.0.x',
        },
        store: 'bower_components',
        dest: '<%= target_dir %>' + '/lib/',
        destfile: 'bower',
      },
    },

    // serve content of target dir on http://localhost:8000/
    // includes watching for changes
    express: {
      app: {
        options: {
          // set to `127.0.0.1` to restrict access from other parties of the
          // same network
          hostname: "0.0.0.0",
          port: 8000,
          open: true,
          bases: ['<%= target_dir %>'],
          livereload: 35729, // default
        },
      },
    },

    // watch files for changes, works w/ express
    watch: {
      options: {
        livereload: 35729, // default
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['bowerful'],
      },
      html: {
        files: ['./src/html/**/*.html'],
        tasks: ['copy:html'],
      },
      css: {
        files: ['./src/css/**/*.css'],
        tasks: ['concat:css'],
      },
      js: {
        files: ['./src/js/**/*.js'],
        tasks: ['concat:js'],
      },
      less: {
        files: ['./src/less/**/*.less'],
        tasks: ['less:default'],
      },
    },

  });

  [
    'grunt-bowerful',
    'grunt-contrib-clean',
    'grunt-contrib-concat',
    'grunt-contrib-copy',
    'grunt-contrib-less',
    'grunt-contrib-watch',
    'grunt-express',
  ].forEach(grunt.loadNpmTasks);

  grunt.registerTask('build', [
    'copy:html',
    'bowerful',
    'concat',
    'less:default',
  ]);
  grunt.registerTask('serve', ['build', 'express:app', 'watch']);
};
