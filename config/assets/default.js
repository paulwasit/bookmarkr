'use strict';

module.exports = {
  server: {
    //gruntConfig: 'gruntfile.js',
    //gulpConfig: 'gulpfile.js',
		allJS:   ['server.js', 'config/**/*.js', 'server/modules/**/*.js'],
    models: 	'server/modules/*/models/**/*.js',
    routes:  ['server/modules/!(core)/routes/**/*.js', 'server/modules/core/routes/**/*.js'],
    sockets: 	'server/modules/*/sockets/**/*.js',
    config: 	'server/modules/*/config/*.js',
    policies: 'server/modules/*/policies/*.js',
    views:		'server/modules/*/views/*.html'
  },
	client: {
		lib: {
			css:"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.6.0/katex.min.css", 
			js: [
				"public/modules/articles/helpers/highlightjs/highlight.pack.js",
				"https://jsconsole.com/js/remote.js?379b26e8-2d11-4c9f-bd41-fd9ff9c57c21"
			]
		},
		js: [],
		css: []
	}
};