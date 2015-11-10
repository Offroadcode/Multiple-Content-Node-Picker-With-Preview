
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var path = require('path');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pkgMeta: grunt.file.readJSON('config/meta.json'),
    dest: grunt.option('target') || 'dist',
    basePath: path.join('<%= dest %>', 'App_Plugins', '<%= pkgMeta.name %>'),

    watch: {
      options: {
        spawn: false,
        atBegin: true
      },
      dll: {
        files: ['PreviewPicker/Umbraco/PreviewPicker/**/*.cs'] ,
        tasks: ['msbuild:dist', 'copy:dll']
      },	  
      js: {
        files: ['PreviewPicker/**/*.js'],
        tasks: ['concat:dist']
      },
      html: {
        files: ['PreviewPicker/**/*.html'],
        tasks: ['copy:html']
      },
	  sass: {
		files: ['PreviewPicker/**/*.scss'],
		tasks: ['sass', 'copy:css']
	  },
	  css: {
		files: ['PreviewPicker/**/*.css'],
		tasks: ['copy:css']
	  },
	  manifest: {
		files: ['PreviewPicker/package.manifest'],
		tasks: ['copy:manifest']
	  }
    },

    concat: {
      options: {
        stripBanners: false
      },
      dist: {
        src: [
            'PreviewPicker/preview.picker.namespaces.js',
            'PreviewPicker/models/preview.picker.editor.models.js',
			'PreviewPicker/resources/doctype.selector.resource.js',
			'PreviewPicker/resources/image.resource.js',
			'PreviewPicker/controllers/doctype.selector.controller.js',
            'PreviewPicker/controllers/preview.picker.editor.controller.js'
        ],
        dest: '<%= basePath %>/js/previewPicker.js'
      }
    },

    copy: {
        dll: {
            cwd: 'PreviewPicker/Umbraco/PreviewPicker/bin/debug/',
            src: 'PreviewPicker.dll',
            dest: '<%= dest %>/bin/',
            expand: true
        },	
        html: {
            cwd: 'PreviewPicker/views/',
            src: [
				'DoctypeSelectorView.html',
                'PreviewPickerEditorView.html'
            ],
            dest: '<%= basePath %>/views/',
            expand: true,
            rename: function(dest, src) {
                return dest + src;
              }
        },
		css: {
			cwd: 'PreviewPicker/css/',
			src: [
				'previewPicker.css'
			],
			dest: '<%= basePath %>/css/',
			expand: true,
			rename: function(dest, src) {
				return dest + src;
			}
		},
        manifest: {
            cwd: 'PreviewPicker/',
            src: [
                'package.manifest'
            ],
            dest: '<%= basePath %>/',
            expand: true,
            rename: function(dest, src) {
                return dest + src;
            }
        },
       umbraco: {
        cwd: '<%= dest %>',
        src: '**/*',
        dest: 'tmp/umbraco',
        expand: true
      }
    },

    umbracoPackage: {
      options: {
        name: "<%= pkgMeta.name %>",
        version: '<%= pkgMeta.version %>',
        url: '<%= pkgMeta.url %>',
        license: '<%= pkgMeta.license %>',
        licenseUrl: '<%= pkgMeta.licenseUrl %>',
        author: '<%= pkgMeta.author %>',
        authorUrl: '<%= pkgMeta.authorUrl %>',
        manifest: 'config/package.xml',
        readme: 'config/readme.txt',
        sourceDir: 'tmp/umbraco',
        outputDir: 'pkg',
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        src: ['app/**/*.js', 'lib/**/*.js']
      }
  },
  
  sass: {
		dist: {
			options: {
				style: 'compressed'
			},
			files: {
				'PreviewPicker/css/previewPicker.css': 'PreviewPicker/sass/previewPicker.scss'
			}
		}
	},
	
  msbuild: {
      options: {
        stdout: true,
        verbosity: 'quiet',
        maxCpuCount: 4,
        version: 4.0,
        buildParameters: {
          WarningLevel: 2,
          NoWarn: 1607
        }
    },
    dist: {
        src: ['PreviewPicker/Umbraco/PreviewPicker/PreviewPicker.csproj'],
        options: {
            projectConfiguration: 'Debug',
            targets: ['Clean', 'Rebuild'],
        }
    }
  },

  clean: {
      build: '<%= grunt.config("basePath").substring(0, 4) == "dist" ? "dist/**/*" : "null" %>',
      tmp: ['tmp'],
      html: [
        'PreviewPicker/views/*.html',
		'!PreviewPicker/views/DoctypeSelectorView.html',
        '!PreviewPicker/views/PreviewPickerEditorView.html'
        ],
      js: [
        'PreviewPicker/controllers/*.js',
		'PreviewPicker/models/*.js',
		'!PreviewPicker/controllers/doctype.selector.controller.js',
        '!PreviewPicker/controllers/preview.picker.editor.controller.js',
		'!PreviewPicker/models/preview.picker.editor.models.js'
      ],
      css: [
        'PreviewPicker/css/*.css',
        '!PreviewPicker/css/previewPicker.css'
      ],
	  sass: [
		'PreviewPicker/sass/*.scss',
		'!PreviewPicker/sass/previewPicker.scss'
	  ]
    }

  });

  grunt.registerTask('default', ['concat', 'sass:dist', 'copy:html', 'copy:manifest', 'copy:css', 'msbuild:dist', 'copy:dll', 'clean:html', 'clean:js', 'clean:sass', 'clean:css']);
  grunt.registerTask('umbraco', ['clean:tmp', 'default', 'copy:umbraco', 'umbracoPackage', 'clean:tmp']);
};
