
// app name + vendor dependencies
module.exports = function (appName) {
	
	var angular = require('angular');
	
	require('angular-ui-notification/dist/angular-ui-notification.css');
	
	return angular.module(appName, 
		[
			require('angular-resource'),         // allows RESTful services via $resource 
			require('angular-messages'),         // show-hide messages based on the state of a key/value object that it listens on (form validation, etc)
			//require('angular-animate'),          // allows animations (menu show/hide, etc)
			require('angular-ui-router'),        // manage states routing
			require('angular-ui-bootstrap'),     // useful UI directives, like tooltip, dropdown, etc.
			require('angular-ui-notification'),  // display custom notifications

			/*
			
			// 'ngSanitize',
			require('ui.utils'), 
			require('ui.sortable'),
			require('ui.select'),
			require('angularFileUpload'),
			require('nemLogging', 'ui-leaflet'),
			//'sticky')
			*/
		]
	);
};
