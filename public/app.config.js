
module.exports = function (ngModule) {
	
	// expose the global services to the entire app
	require('./modules/_core/services/menu.creation')(ngModule);
	require('./modules/_core/services/authentication')(ngModule);
	require('./modules/_core/services/authInterceptor')(ngModule);

	// Setting HTML5 Location Mode & Disabling ngAnimate on ng-animate-disabled class & disable animations for popover
	ngModule.config(
	//function($locationProvider, $animateProvider, $uibTooltipProvider, markedProvider) {
	function($locationProvider, $animateProvider, $httpProvider, cfpLoadingBarProvider) {
		
		$locationProvider.html5Mode(true).hashPrefix('!');
		$httpProvider.interceptors.push('authInterceptor');
		cfpLoadingBarProvider.includeSpinner = false;
		//cfpLoadingBarProvider.latencyThreshold = 0;
		//$animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
		$animateProvider.classNameFilter(/angular-animate/);
		//$uibTooltipProvider.options({ animation: false });
		
		/*
		$httpProvider.interceptors.push(function($q, $injector) {
			return {
				'responseError': function(rejection, $injector) {
					// do something on error
					if(rejection.status === 404) {
						$injector.get('$state').go('app.not-found');
					}
					else if(rejection.status === 400) {
						$injector.get('$state').go('app.bad-request');
					}
				}
			};
		});
		*/
		
	});
	
};