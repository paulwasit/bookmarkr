'use strict'

module.exports = function (appModule) {
	
	require('angularjs-slider/dist/rzslider.css');
	
	// module name
	var moduleName = 'projects';
	
	// module init
	angular.module(moduleName, [
		require("angularjs-slider/dist/rzslider")
	]);
	appModule.requires.push(moduleName);
	var ngModule = angular.module(moduleName);
	
	// modules elements
	require('./menus')(ngModule);
	require('./routes')(ngModule);
	require('./components/pw-smart-keyboard/pw-smart-keyboard')(ngModule);
	require('./components/pw-storm-report/pw-storm-report')(ngModule);
	
};

// webpack hot reload
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(function() {});
}