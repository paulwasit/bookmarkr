'use strict';

angular.module('shows').directive('pwShowView', ['$stateParams', '$location', 'Authentication', 'Show',
function($stateParams, $location, Authentication, Show) {
  return {
		replace: true,
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-view/pw-show-view.html',
		
		link: function(scope, element, attrs) {
			
			//scope.authentication = Authentication;
			//if (!scope.authentication.user) $location.path('/');
			
			scope.show = Show.get({ id: $stateParams.id });
			
			scope.nextEpisode = scope.show.episodes.filter(function(episode) {	
				return new Date(episode.firstAired) > new Date();
			})[0];
			
			/*
			scope.remove = function(show) {
				if (show) {
					show.$remove();
				} 
				else {
					scope.show.$remove(function() {
						$location.path('articles');
					});
				}
			};
			*/
			
    },
		
		scope: {}
  };
}]);