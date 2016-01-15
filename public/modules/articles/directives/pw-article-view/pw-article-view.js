'use strict';

angular.module('articles')
.directive('pwArticleView', ['$stateParams', '$location', 'Authentication', 'Articles',
function($stateParams, $location, Authentication, Articles) {
  return {
    restrict: 'E',
    templateUrl: 'modules/articles/directives/pw-article-view/pw-article-view.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			scope.authentication = Authentication;
			scope.article = Articles.get({ articleId: $stateParams.articleId });
			scope.disabled = false;
			
			scope.remove = function(article) {
				if (article) {
					article.$remove();
					
					for (var i in scope.articles) {
						if (scope.articles[i] === article) {
							scope.articles.splice(i, 1);
						}
					}
					
				} 
				else {
					scope.article.$remove(function() {
						$location.path('articles');
					});
				}
			};
			
    }
  };
}]);