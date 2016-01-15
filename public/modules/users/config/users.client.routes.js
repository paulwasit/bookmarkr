'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
		
			// settings
      .state('app.settings', {
        abstract: true,
        url: '/settings',
        template: '<pw-user-settings></pw-user-settings>',
        data: {
          roles: ['user', 'admin'],
					title: 'Settings'
        }
      })
      .state('app.settings.profile', {
        url: '/profile',
        template: '<pw-user-profile></pw-user-profile>',
				title: 'Profile'
      })
      .state('app.settings.password', {
        url: '/password',
        template: '<pw-user-password></pw-user-password>'
      })
      .state('app.settings.accounts', {
        url: '/accounts',
        template: '<pw-user-accounts></pw-user-accounts>'
      })
      .state('app.settings.picture', {
        url: '/picture',
        template: '<pw-user-picture></pw-user-picture>'
      })
			
			// authentication
      .state('app.authentication', {
        abstract: true,
        url: '/authentication',
        template: '<ui-view/>'
      })
      .state('app.authentication.signup', {
        url: '/signup',
        template: '<pw-auth sign-in-or-up="up"></pw-auth>'
      })
      .state('app.authentication.signin', {
        url: '/signin?err',
        template: '<pw-auth sign-in-or-up="in"></pw-auth>'
      })
			
			// password
      .state('app.password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('app.password.forgot', {
        url: '/forgot',
        template: '<pw-pass-forgot></pw-pass-forgot>'
      })
      .state('app.password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
			.state('app.password.reset.form', {
        url: '/:token',
        template: '<pw-pass-reset></pw-pass-reset>'
      })
      .state('app.password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/directives/pw-pass/pw-pass-reset/reset-password-invalid.client.view.html'
      })
      .state('app.password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/directives/pw-pass/pw-pass-reset/reset-password-success.client.view.html'
      });
      
  }
]);
