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
  }
	// , client: {
    // lib: {
      // css: [
				//'public/lib/bootstrap/dist/css/bootstrap.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				// 'public/lib/font-awesome/css/font-awesome.min.css',
				// 'public/lib/textAngular/dist/textAngular.css',
				// 'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
				// 'public/lib/leaflet/dist/leaflet.css',
				// 'public/lib/codemirror/lib/codemirror.css'
      // ],
      // js: [
				// 'public/lib/jquery/dist/jquery.js',
				// 'public/lib/jquery-ui/jquery-ui.js',
				// 'public/lib/codemirror/lib/codemirror.js',
				// 'public/lib/codemirror/mode/xml/xml.js',
        // 'public/lib/angular/angular.js',
        // 'public/lib/angular-resource/angular-resource.js',
        // 'public/lib/angular-animate/angular-animate.js',
        // 'public/lib/angular-messages/angular-messages.js',
        // 'public/lib/angular-ui-router/release/angular-ui-router.js',
        // 'public/lib/angular-ui-utils/ui-utils.js',
        // 'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        // 'public/lib/angular-file-upload/angular-file-upload.js',
        // 'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
				// 'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
				// 'public/lib/moment.min.js',
				// 'public/lib/leaflet/dist/leaflet.js',
				// 'public/lib/angular-simple-logger/dist/angular-simple-logger.js',
				// 'public/lib/ui-leaflet/dist/ui-leaflet.js',
				// 'public/lib/textAngular/dist/textAngular-rangy.min.js',
				// 'public/lib/textAngular/dist/textAngular-sanitize.min.js',
				// 'public/lib/textAngular/dist/textAngular.min.js',
				// 'public/lib/angular-ui-codemirror/ui-codemirror.js',
				// 'public/lib/ngSticky/dist/sticky.min.js',
				// 'public/lib/angular-ui-sortable/sortable.js'
				
      // ],
      // tests: ['public/lib/angular-mocks/angular-mocks.js']
    // },
    // css: [
      // 'public/modules/**/css/*.css'
    // ],
    // less: [
      // 'public/modules/**/less/*.less'
    // ],
		// sassGlob: 'public/modules/_core/assets/core.scss',
    // sass: [
      // 'public/modules/**/scss/*.scss'
    // ],
    // js: [
      // 'public/config.js',
      // 'public/init.js',
      // 'public/modules/*/*.module.js',
			// 'public/modules/*/*.js',
      // 'public/modules/*/!(tests)/**/*.js'
    // ],
    // views: ['public/modules/*/views/**/*.html'],
    // templates: ['public/build/templates.js']
  // }
	
};
