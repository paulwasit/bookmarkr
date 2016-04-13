'use strict';

angular.module('articles')
.directive('pwArticleViewEdit', ['$anchorScroll', '$compile', '$stateParams', '$location', 'Authentication', 'Articles', 'Notification', 'markedpp', 
function($anchorScroll, $compile, $stateParams, $location, Authentication, Articles, Notification, markedpp) {
  return {
    restrict: 'E',
    templateUrl: 'modules/articles/directives/pw-article-viewedit/pw-article-viewedit.html',
		scope: {},
		link: function(scope, element, attrs) {
			
			// authentication
			scope.authentication = Authentication;
			scope.article = Articles.get({ articleId: $stateParams.articleId }, function () {
				//select the first tab by default
				scope.article.content[0].active = true;
			});
			
			// test
			var md = '!numberedheadings\n!toc(level=1)\n# hello\n## hello again';
			markedpp(md, function(err, result){
					console.log(result);
			});
			
			// codemirror options
			scope.editorOptions = {
				indentUnit: 4,
        lineWrapping : true,
        lineNumbers: false,
        readOnly: false, //'nocursor'
        mode: 'markdown',
			};
		
			// manage anchors - see http://stackoverflow.com/questions/14026537/anchor-links-in-angularjs
			scope.scrollTo = function (id) {
				console.log('here');
				$location.hash(id);
				$anchorScroll();  
			};
			
			// tabs selection
			scope.select = function (selectedTab) {
		
				angular.forEach(scope.article.content, function(tab) {
					if (tab.active && tab !== selectedTab) {
						tab.active = false;
						//tab.onDeselect();
						selectedTab.selectCalled = false;
					}
				});
				selectedTab.active = true;
				// only call select if it has not already been called
				if (!selectedTab.selectCalled) {
					//selectedTab.onSelect();
					selectedTab.selectCalled = true;
				}
				
			};
			
			
			// tab position in the tabs array: first, empty or last
			scope.position = function(tab) {
				var idx = scope.article.content.indexOf(tab);
				if (idx === -1) return;
				if (idx === 0) return 'first';
				if (idx === scope.article.content.length - 1) return 'last';
			};
			
			// add a new tab
			scope.createNewTab = function () {
				
				var newIndex = scope.article.content.length + 1;
				var tabName = prompt("Please enter the tab name",'tab' + newIndex);

				if (tabName !== '' && tabName !== undefined && tabName !== null) {
					tabName = (tabName !== '') ? tabName : 'tab' + newIndex;
					scope.article.content.push({title: tabName, body: '# ' + tabName + '\r\n\r\nNew_content'});
					scope.update(false); 
				}
				
			};
			
			// delete a tab
			scope.deleteTab = function (tab) {
				var idx = scope.article.content.indexOf(tab);
				if (idx === -1) return;
				scope.article.content.splice(idx, 1);
				scope.update(false); 
			};
			
			// merge tabs - append after idx+1 or before idx-1
			scope.mergeTabs = function (tab, direction) {
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