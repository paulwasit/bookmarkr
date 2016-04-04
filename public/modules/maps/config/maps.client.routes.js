'use strict';

// Setting up route
angular.module('maps').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('app.maps', {
        url: '/maps',
        template: '<pw-maps></pw-maps>',
        data: {
          roles: ['user', 'admin']
        }
      });
      
  }
]);
