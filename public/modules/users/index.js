'use strict'

module.exports = function (appModule) {
	
	// module name
	var moduleName = 'users';
	
	// module init
	angular.module(moduleName, []);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./assets/css/users.css');
	require('./routes')(ngModule);
	require('./rest')(ngModule);
	require('.//directives/pw-auth/pw-auth')(ngModule);
	/*
	require('.//directives/pw-pass-forgot/pw-pass-forgot')(ngModule);
	require('.//directives/pw-pass-reset/pw-pass-reset')(ngModule);
	require('.//directives/pw-user-settings/pw-user-settings')(ngModule);
	*/
	
};