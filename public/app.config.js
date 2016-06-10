
module.exports = function (ngModule) {
	
	// expose the global services to the entire app
	require('./modules/_core/services/menu.creation')(ngModule);
	require('./modules/_core/services/authentication')(ngModule);
	require('./modules/_core/services/authInterceptor')(ngModule);

	// Setting HTML5 Location Mode & Disabling ngAnimate on ng-animate-disabled class & disable animations for popover
	ngModule.config(
	//function($locationProvider, $animateProvider, $uibTooltipProvider, markedProvider) {
	function($locationProvider, $httpProvider) {
		
		$locationProvider.html5Mode(true).hashPrefix('!');
		$httpProvider.interceptors.push('authInterceptor');
		
		//$animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
		//$uibTooltipProvider.options({ animation: false });
		
	});
	
};