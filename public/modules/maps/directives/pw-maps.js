'use strict';

angular.module('maps')
.directive('pwMaps', ['$location', 'leafletData',
function($location, leafletData) {
  return {
    restrict: 'E',	
    templateUrl: 'modules/maps/directives/pw-maps.html',
		scope: {},
		controller: ['$scope', function($scope) {
			angular.extend($scope, {
				center: {
            lat: 48.86,
            lng: 2.34,
            zoom: 6
        },
				defaults: {
					scrollWheelZoom: true
				}
			});
		}],
		link: function(scope, element, attrs) {
			
			//use this when you want the url to include your map coordinates
			scope.$on("centerUrlHash", function(event, centerHash) {
        $location.search({ c: centerHash });
			});	
			
			scope.changeLocation = function(centerHash) {
				$location.search({ c: centerHash });
			};
			/*
			leafletData.getMap().then(function(map) {
            L.GeoIP.centerMapOnPosition(map, 15);
        });
			*/
    }
  };
}]);