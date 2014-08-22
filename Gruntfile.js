// FEATURES:
//  - cp html
//  - concat css
//  - concat js
//  - compile less
//  - install and concat bower components (bower.json)
//  - clean
//  - express / livereload
//
// TODO:
//  - add normalize.css via bower
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

    // install deps from `bower.json`
    bower: {
      install: {
        options: {
          copy: false, // don't copy , we will concat later
        },
      },
    },
    // concat all installed bower components
    bower_concat: {
      all: {
        dest: '<%= target_dir %>' + '/js/bower.js',
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
      bower: {
        files: ['./bower.json'],
        tasks: ['bower:install', 'bower_concat'],
      }
    },

  });

  [
    'grunt-bower-concat',
    'grunt-bower-task',
    'grunt-contrib-clean',
    'grunt-contrib-concat',
    'grunt-contrib-copy',
    'grunt-contrib-less',
    'grunt-contrib-watch',
    'grunt-express',
  ].forEach(grunt.loadNpmTasks);

  grunt.registerTask('build', [
    'copy:html',
    'bower:install',
    'bower_concat',
    'concat',
    'less:default',
  ]);
  grunt.registerTask('serve', ['build', 'express:app', 'watch']);
};
