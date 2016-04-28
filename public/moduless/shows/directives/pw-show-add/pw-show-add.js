'use strict';

angular.module('shows')
.directive('pwShowAdd', ['Show', 'Notification', function(Show, Notification) {
  return {
		restrict: 'E',
		//replace: true,
    templateUrl: 'modules/shows/directives/pw-show-add/pw-show-add.html',
		scope: {},
		link: function(scope, element, attrs) {
			
      //scope.shows = Show.query();
			scope.resetForm = function() {
				scope.pending = scope.series = scope.multipleChoicesFor = scope.ctrlShowName = null;
				scope.addForm.$setPristine();
			};
			
			scope.addShowUnique = function(event) {
				scope.ctrlShowName = event.target.value;
				scope.addShow(true);
			};
			
			// function called when the user submits the form in add.html
			scope.addShow = function(isUnique) {

				scope.pending = true;
				
				// '.save' sends a POST request to the '/api/shows/' with the $scope.showName sent by the submit button. It will add the show to the mongoDB using the Show model.
				Show.save({ showName: scope.ctrlShowName, isUnique: isUnique },
					
					// sucess function
					function () {
						Notification.success(scope.ctrlShowName + ' was successfully added');
						scope.resetForm();
					},
					
					// error function, using httpResponse
					function(response) {

						Notification.error(response.data.message);
						
						if (response.data.series) {
							scope.pending = null;
							scope.series = response.data.series;
							scope.multipleChoicesFor = scope.ctrlShowName;
							scope.ctrlShowName = null;
							scope.addForm.$setPristine();
						}
						else {
							scope.resetForm();
						}
						
					}
					
				);
			};
			
    }
  };
}]);