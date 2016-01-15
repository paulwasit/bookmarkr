'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

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
    .state('app.home', {
      url: '/',
      templateUrl: 'modules/_core/views/home.client.view.html'
    })
    .state('app.not-found', {
      url: '/not-found',
      templateUrl: 'public/modules/_core/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('app.bad-request', {
      url: '/bad-request',
      templateUrl: 'public/modules/_core/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('app.forbidden', {
      url: '/forbidden',
      templateUrl: 'public/modules/_core/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);
