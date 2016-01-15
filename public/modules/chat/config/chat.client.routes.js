'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('app.chat', {
        url: '/chat',
        template: '<pw-chat></pw-chat>',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
