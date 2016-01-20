'use strict';

angular.module('articles')
.directive('pwArticleViewEdit', ['$compile', '$stateParams', '$location', 'Authentication', 'Articles', 'Notification',
function($compile, $stateParams, $location, Authentication, Articles, Notification) {
  return {
    restrict: 'E',
    templateUrl: 'modules/articles/directives/pw-article-viewedit/pw-article-viewedit.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			scope.authentication = Authentication;
			scope.article = Articles.get({ articleId: $stateParams.articleId }, function () {
			});
			
			
			scope.addTab = function () {
				var newIndex = scope.article.content.length + 1;
				scope.article.content.push({title: 'tab' + newIndex, body: ''});
				scope.update(false);
			};
			
			// Toggle edit mode
			scope.disabled = true;
			/*document.getElementById('editableTitle').contentEditable='false';*/
			
			scope.toggleEditMode = function () {
				scope.disabled = !scope.disabled;
				/*
				if (document.getElementById('editableTitle').contentEditable==='false') {
					document.getElementById('editableTitle').contentEditable='true';
				}
				else {
					document.getElementById('editableTitle').contentEditable = 'false';
				}
				*/
			};
			
			// Make an Article Public / Private
			scope.toggleIsPublic = function() {
				scope.article.isPublic = !scope.article.isPublic;
				scope.article.$update();
			};
			
			// Delete existing Article
			scope.remove = function(article) {
				/*
				scope.article.$remove(function() {
					$location.path('articles');
				});
				*/
			};
			
			// Update existing Article
			scope.update = function(isDone) {
				
				isDone = (isDone === undefined || isDone === null) ? true : isDone;
				scope.error = null;
				
				/*
				if (!isValid) {
					scope.$broadcast('show-errors-check-validity', 'articleForm');
					return false;
				}
				*/
				
				/*
				if (document.getElementById('editableTitle').textContent === '') {
					return Notification.error('Please enter a title');
				}
				scope.article.title = document.getElementById('editableTitle').textContent;
				*/
				
				var article = scope.article;

				article.$update(
				function() {
					Notification.success('article successfully updated');
					if (isDone) {
						//$compile(element)(scope);
						scope.toggleEditMode();
					}
				}, 
				function(errorResponse) {
					scope.error = errorResponse.data.message;
					Notification.error(scope.error);
				});
				
			};
			
    }
		
  };
}]);