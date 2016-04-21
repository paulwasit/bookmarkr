'use strict';

module.exports = function (ngModule) {

	require('../../../_misc/pw-in-header')(ngModule);
	//require('../../assets/highlightjs/highlight.pack.js');
	require('../../assets/highlightjs/styles/github.css');
	//hljs.initHighlightingOnLoad();
	
	ngModule.directive('pwArticleViewEdit', function($compile, $stateParams, $location, $document, Authentication, Articles, Notification) {
		return {
			restrict: 'E',
			template: require('./pw-article-viewedit.html'),
			scope: {},
			link: function(scope, element, attrs) {
				
				/*
				$document.on('scroll', function() {
					console.log('Document scrolled to ', $document.scrollLeft(), $document.scrollTop());
				});
				*/
				
				// authentication
				scope.authentication = Authentication;
				scope.article = Articles.get({ articleId: $stateParams.articleId }, function () {
					//select the first tab by default
					scope.article.content[0].active = true;
				});
				
				scope.isSomething = true;
				
				// codemirror options
				scope.editorOptions = {
					indentUnit: 4,
					lineWrapping : true,
					lineNumbers: false,
					readOnly: false, //'nocursor'
					mode: 'markdown',
					viewportMargin: Infinity
				};
				
				// tabs selection
				scope.select = function (selectedTab) {
			
					angular.forEach(scope.article.content, function(tab) {
						if (tab.active && tab !== selectedTab) {
							console.log(tab);
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
					scope.article.$update(
					function() {
						Notification.success('article successfully updated');
						scope.select(scope.article.content[0]);
					}, 
					function(errorResponse) {
						scope.error = errorResponse.data.message;
						Notification.error(scope.error);
					});
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
						scope.select(scope.article.content[0]);
						//console.log(scope.isSomething);
						//scope.isSomething = !scope.isSomething;
						//console.log(scope.isSomething);
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
	});
	
};