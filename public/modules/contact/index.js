'use strict'

module.exports = function (appModule) {
	
	// module name
	var moduleName = 'contact';
	
	// module init
	angular.module(moduleName, []);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./menus')(ngModule);
	require('./routes')(ngModule);
	require('./pw-contact')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}