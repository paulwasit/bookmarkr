'use strict';

module.exports = function (ngModule) {
	
	ngModule.factory('authInterceptor', function ($q, $injector, Authentication) {
		return {
			responseError: function(rejection) {
				if (!rejection.config.ignoreAuthModule) {
					switch (rejection.status) {
						case 400:
							$injector.get('$state').transitionTo('app.bad-request', null, {
								location: false
							});
							break;
						case 401:
							Authentication.user = null; // Deauthenticate the global user
							$injector.get('$state').transitionTo('app.authentication.signin');
							break;
						case 403:
							$injector.get('$state').transitionTo('app.forbidden', null, {
								location: false
							});
							break;
						case 404:
							$injector.get('$state').transitionTo('app.not-found', null, {
								location: false
							});
							break;
					}
				}
				// otherwise, default behaviour
				return $q.reject(rejection);
			}
		};
	});
	
};
