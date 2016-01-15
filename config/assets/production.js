'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        //'public/lib/bootstrap/dist/css/bootstrap.min.css',
        //'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'public/lib/textAngular/dist/textAngular.css',
				'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
				'public/lib/leaflet/dist/leaflet.css',
				'public/lib/codemirror/lib/codemirror.css'
      ],
      js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/jquery-ui/jquery-ui.min.js',
				'public/lib/codemirror/lib/codemirror.js',
				'public/lib/codemirror/mode/xml/xml.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
				'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
				'public/lib/moment.min.js',
				'public/lib/leaflet/dist/leaflet.js',
				'public/lib/angular-simple-logger/dist/angular-simple-logger.min.js',
				'public/lib/ui-leaflet/dist/ui-leaflet.min.js',
				'public/lib/textAngular/dist/textAngular-rangy.min.js',
				'public/lib/textAngular/dist/textAngular-sanitize.min.js',
				'public/lib/textAngular/dist/textAngularSetup.js',
				'public/lib/textAngular/dist/textAngular.js',
				'public/lib/angular-ui-codemirror/ui-codemirror.min.js',
				'public/lib/ngSticky/dist/sticky.min.js',
				'public/lib/angular-ui-sortable/sortable.min.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};