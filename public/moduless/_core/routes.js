'use strict';

module.exports = function (ngModule) {
  
	ngModule.config(function ($stateProvider, $urlRouterProvider) {
		
    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
			$injector.get('$state').transitionTo('app.not-found', null, {
        location: false
      });
    });
		
    // Home state routing
    $stateProvider
		.state('app', {
			template: '<pw-layout></pw-layout>'
		})
    .state('app.not-found', {
      url: '/not-found',
      template: require('./views/404.client.view.html'),
      data: {
        ignoreState: true
      }
    })
    .state('app.bad-request', {
      url: '/bad-request',
      template: require('./views/400.client.view.html'),
      data: {
        ignoreState: true
      }
    })
    .state('app.forbidden', {
      url: '/forbidden',
      template: require('./views/403.client.view.html'),
      data: {
        ignoreState: true
      }
    });
		
  });
	
};