'use strict'

module.exports = function (appModule) {
	
	// module name
	var moduleName = 'core';
	
	// module init
	angular.module(moduleName, []);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./assets/core.scss');
  require('./routes')(ngModule);
	var Items = require('../items/services/items.service')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}