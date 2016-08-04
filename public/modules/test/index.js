'use strict'

module.exports = function (appModule) {
	
	// module name
	var moduleName = 'test';
	
	// module init
	angular.module(moduleName, [
		require('angular-animate'),        // allows animations (menu show/hide, etc)
	]);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./menus')(ngModule);
	require('./routes')(ngModule);
	require('./testing')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}