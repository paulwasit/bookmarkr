'use strict';

angular.module('articles')
.directive('pwArticleEdit', ['$state', '$stateParams', '$location', 'Articles', 'Notification', 
function($state, $stateParams, $location, Articles, Notification) {
  return {
    restrict: 'E',	
    templateUrl: 'modules/articles/directives/pw-article-edit/pw-article-edit.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			scope.article = Articles.get({ articleId: $stateParams.articleId });
			scope.disabled = false;
			
			// Update existing Article
			scope.update = function(isValid, isDone) {
				
				isDone = (isDone === undefined || isDone === null) ? true : isDone;
				scope.error = null;
				
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'articleForm');
					return false;
				}
				
				var article = scope.article;

				article.$update(
				function() {
					Notification.success('article successfully updated');
					if (isDone) $location.path('articles/' + article._id);
				}, 
				function(errorResponse) {
					scope.error = errorResponse.data.message;
					Notification.error(scope.error);
				});
			};
			
    }
  };
}]);