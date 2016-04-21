'use strict';

// Setting up route - see http://stackoverflow.com/questions/26354021/injecting-ui-router-resolve-to-directive 
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('app.admin.users', {
        url: '/users',
        template: '<pw-users-list></pw-users-list>'
      })
      .state('app.admin.user', {
        url: '/users/:userId',
        template: '<pw-user-view user="userResolve"></pw-user-view>',
				controller: ['$scope', 'userResolve', function($scope, userResolve) {
					$scope.userResolve = userResolve;
				}],
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('app.admin.user-edit', {
        url: '/users/:userId/edit',
        template: '<pw-user-edit user="userResolve"></pw-user-edit>',
				controller: ['$scope', 'userResolve', function($scope, userResolve) {
					$scope.userResolve = userResolve;
				}],
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);
