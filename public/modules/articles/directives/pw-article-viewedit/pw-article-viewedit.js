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
			
			scope.position = function(tab) {
				var idx = scope.article.content.indexOf(tab);
				if (idx === -1) return;
				if (idx === 0) return 'first';
				if (idx === scope.article.content.length - 1) return 'last';
			};
			
			scope.createNewTab = function () {
				
				var newIndex = scope.article.content.length + 1;
				var tabName = prompt("Please enter the tab name",'tab' + newIndex);

				if (tabName !== '' && tabName !== undefined && tabName !== null) {
					tabName = (tabName !== '') ? tabName : 'tab' + newIndex;
					scope.article.content.push({title: tabName, body: '# ' + tabName + '\r\n\r\nNew_content'});
					scope.update(false); 
				}
				
			};
			
			scope.deleteTab = function (tab) {
				var idx = scope.article.content.indexOf(tab);
				if (idx === -1) return;
				scope.article.content.splice(idx, 1);
				scope.update(false); 
			};
			
			// append after idx+1 or before idx-1
			scope.mergeTabs = function (tab, direction) {
				console.log(tab);
				var idx = scope.article.content.indexOf(tab);
				if (idx === -1) return;
				if (direction === 'up') {
					scope.article.content[idx-1].body = scope.article.content[idx-1].body + '\r\n\r\n' + scope.article.content[idx].body;
				}
				else {
					scope.article.content[idx+1].body = scope.article.content[idx].body + '\r\n\r\n' + scope.article.content[idx+1].body;
				}
				scope.deleteTab(tab);
			};
			
			// Toggle edit mode
			scope.disableEdit = true;
			/*document.getElementById('editableTitle').contentEditable='false';*/
			
			scope.toggleEditMode = function () {
				scope.disableEdit = !scope.disableEdit;
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