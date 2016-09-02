
// app name + vendor dependencies
module.exports = function (appName) {
	
	var angular = require('angular');
	
	require('angular-ui-notification/dist/angular-ui-notification.css');
	require('angular-loading-bar/build/loading-bar.css');
	require('angular-ui-bootstrap/dist/ui-bootstrap-csp.css');
	require("angular-google-chart/ng-google-chart");
	
	return angular.module(appName, 
		[
			require('angular-resource'),         // allows RESTful services via $resource 
			require('angular-messages'),         // show-hide messages based on the state of a key/value object that it listens on (form validation, etc)
			//require('angular-animate'),        // allows animations (menu show/hide, etc)
			require('angular-ui-router'),        // manage states routing
			
			require('angular-hammer'),					 // touchscreen actions
			
			require('angular-ui-bootstrap/src/collapse'),     							 // navbar collapse in a button
			require('angular-ui-bootstrap/src/dropdown/index-nocss.js'),     // navbar dropdown
			require('angular-ui-bootstrap/src/modal/index-nocss.js'),
			require('angular-ui-bootstrap/src/popover/index-nocss.js'),
			require('angular-ui-bootstrap/src/tooltip/index-nocss.js'),
			require('angular-ui-bootstrap/src/progressbar/index.js'),
			require('angular-ui-bootstrap/src/tabs/index.js'),
			
			'googlechart',
			
			require('angular-ui-notification'),  // display custom notifications
			require('angular-loading-bar'), 
			/*
			// 'ngSanitize',
			require('ui.select'),
			require('nemLogging', 'ui-leaflet'),
			//'sticky')
			*/
		]
	);
};
