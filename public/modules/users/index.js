'use strict'

module.exports = function (appModule) {
	
	// module name
	var moduleName = 'users';
	
	require('angular-file-upload/src');
	
	// module init
	angular.module(moduleName, 
		[
			"angularFileUpload"
		]
	);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./assets/css/users.css');
	require('./routes')(ngModule);
	require('./rest')(ngModule);
	require('./directives/pw-auth/pw-auth')(ngModule);
	require('./directives/pw-settings/pw-user-settings')(ngModule);
	require('./directives/pw-settings/pw-user-accounts/pw-user-accounts')(ngModule);
	/*
	require('./directives/pw-pass-forgot/pw-pass-forgot')(ngModule);
	require('./directives/pw-pass-reset/pw-pass-reset')(ngModule);
	*/
	
	
	
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}