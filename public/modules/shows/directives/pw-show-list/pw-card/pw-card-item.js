'use strict';

angular.module('shows').directive('pwCardItem', ['pwArrayToggle', function(pwArrayToggle) {
	
  return {
    restrict: 'E',
    templateUrl: 'modules/shows/directives/pw-show-list/pw-card/pw-card-item.html',
		scope: {
      show: '='
    },
		require: ['^pwShowList', '^pwCardList'],
		link: function(scope, element, attrs, ctrls) { 

			var pwShowListCtrl = ctrls[0],
					pwCardListCtrl = ctrls[1];
			
			scope.toggle = function(field, value) {
				if (field === 'genres') return pwArrayToggle(pwShowListCtrl.activeTags, value);
			};
			
			scope.isActive = function(field, value) {
				if (field === 'genres') return pwShowListCtrl.activeTags.indexOf(value) !== -1;
			};
			
    }
  };
	
}]);