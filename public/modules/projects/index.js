'use strict'

module.exports = function (appModule) {
	
	// module name
	var moduleName = 'projects';
	
	// module init
	angular.module(moduleName, []);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./menus')(ngModule);
	require('./routes')(ngModule);
	require('./directives/pw-smart-keyboard/pw-smart-keyboard')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}