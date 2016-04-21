'use strict';

module.exports = function (ngModule) {
  
	ngModule.config(function ($stateProvider, $urlRouterProvider) {
		
    // Home state routing
    $stateProvider
    .state('app.home', {
      url: '/',
      template: require('./home.html')
    });
		
  });
	
};