'use strict'

module.exports = function (appModule) {
	
	// module name
	var moduleName = 'layout';
	
	// module init
	angular.module(moduleName, []);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./routes')(ngModule);
	require('./directives/pw-layout')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}