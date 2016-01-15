'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('app.maps', {
        url: '/maps',
        template: '<pw-maps></pw-user-maps>',
        data: {
          roles: ['user', 'admin']
        }
      });
      
  }
]);
