'use strict';

module.exports = function (ngModule) {

	require('../../../_misc/pw-focus-me')(ngModule);	
	require('../../../_misc/pw-in-header')(ngModule);	
	require('../../../_misc/pw-click-outside')(ngModule);    // shows the menu item / dropdown
	
	require('../../assets/highlightjs/styles/github.css');

	var modalTemplate = require('../../../_misc/pw-modal-template');
	var modalConfirmTemplate = require('../../../_misc/pw-modal-confirm');
	
	ngModule.directive('pwArticleViewEdit', function($stateParams, $location, $document, $uibModal, $interval, $rootScope, Authentication, Articles, Notification) {
		return {
			restrict: 'E',
			template: require('./pw-article-viewedit.html'),
			scope: {
				article: "="
			},
			link: function(scope, element, attrs) {
				
			// ------------------------------ ARTICLE PARAMS ------------------------------ //
				
				// articleOld saves the previous value of the article when running the interval save fn;
				// if no change, the server update fn is not called (limits calls to server)
				scope.articleOld = false;
				
				// authentication
				scope.authentication = Authentication;
				
				// init
				scope.article.content[0].active = true; //select the first tab by default
				
				// trigger toc collapse (small screens)
				scope.isTocCollapsed = true;
				$rootScope.$on("toggle-navbar-collapse", function (event, data) {
					scope.isTocCollapsed = data;
				});
				
				
				
				// action on click-outside
				scope.closeThis = function () { scope.isTocCollapsed = true; };
				
				// trigger for codemirror refresh
				scope.isSomething = true;
				
				// codemirror options
				scope.editorOptions = {
					scrollbarStyle: "null",
					indentUnit: 4,
					lineWrapping : true,
					lineNumbers: false,
					readOnly: false, //'nocursor'
					mode: 'markdown',
					viewportMargin: Infinity
				};
				
				
			// ------------------------------ TABS MANIPULATION ------------------------------ //
				
				// tab position in the tabs array: first, empty or last
				scope.position = function(tab) {
					var idx = scope.article.content.indexOf(tab);
					if (idx === -1) return;
					if (idx === 0) return 'first';
					if (idx === scope.article.content.length - 1) return 'last';
				};
				
				// tabs selection
				scope.select = function (selectedTab) {
					scope.isTocCollapsed = true; /* close the toc on small screens when changing tab */
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
					scope.isSomething = !scope.isSomething ;
				};
				
				// delete a tab
				scope.deleteTab = function (tab) {
					
					var modalInstance = $uibModal.open( modalConfirmTemplate("Confirm suppression?") );
					modalInstance.result.then(function () {
						var idx = scope.article.content.indexOf(tab);
						if (idx === -1) return;
						scope.article.content.splice(idx, 1);
						if (tab.active) {
							if (idx === scope.article.content.length) idx=idx-1;
							scope.select(scope.article.content[idx]);
						}
						updateFn(); 
					}, function () {});	
					
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
				
				scope.sortableConfig = {
					ghostClass: "article-toc-ghost",
					animation: 150,
					disabled: true,
					onSort: function (evt){
						updateFn();
					}
				};
				
			
			// ------------------------------ TABS MODALS ------------------------------ //
				
				// add a new tab
				scope.createNewTab = function () {
					var modalInstance = $uibModal.open( modalTemplate("Page Title", "New Page") );
					modalInstance.result.then(function (newTitle) {
						scope.article.content.push({title: newTitle, body: '#### New_Title\r\n\r\nNew_content'});
						updateFn(); 
						scope.select(scope.article.content[scope.article.content.length-1]);
					}, function () {});	
					
				};
				
				// Rename Tab
				scope.renameTab = function (tab) {
					var idx = scope.article.content.indexOf(tab);
					if (idx === -1) return;
					var modalInstance = $uibModal.open(modalTemplate("Page Title", tab.title));
					modalInstance.result.then(function (newTitle) {
						tab.title = newTitle;
					}, function () {});

				};
				
				// Rename Article Title
				scope.renameTitle = function () {
					var modalInstance = $uibModal.open(modalTemplate("Article Title", scope.article.title));
					modalInstance.result.then(function (newTitle) {
						scope.article.title = newTitle;
					}, function () {});

				};	
				
				
			// ------------------------------ EDIT MODE ------------------------------ //	
				
				
				// Toggle edit mode
				scope.disableEdit = true;
				/*document.getElementById('editableTitle').contentEditable='false';*/
				
				scope.toggleEditMode = function () {
					scope.disableEdit = !scope.disableEdit;
					scope.sortableConfig.disabled = !scope.sortableConfig.disabled;
					if (!scope.disableEdit) {
						scope.StartTimer();
					}
					else {
						updateFn();
						scope.StopTimer();
						// allows the scrollspy to reset when leaving the edit mode
						// this is necessary because the ng-if destroys the scope previously used to spy on elements
						$rootScope.$broadcast('$locationChangeSuccess'); 
					}
				};
				
				//Timer object
				scope.Timer = null;
	 
				//Timer start function.
				scope.StartTimer = function () {
					scope.Timer = $interval(updateFn, 10000);
				};
	 
				//Timer stop function.
				scope.StopTimer = function () {
					if (angular.isDefined(scope.Timer)) $interval.cancel(scope.Timer);
				};
				
				scope.$on("$destroy",	function () {
					if (!scope.disableEdit) {
						updateFn();
						scope.StopTimer();
					}
				});
				
				// Update existing Article
				function updateFn () {
					
					var article = angular.copy(scope.article); // deep copy to prevent flickering
					
					if (scope.articleOld === false) {
						scope.articleOld = angular.copy(scope.article);
					}
					else if (angular.equals(article,scope.articleOld)) {
						//Notification.info('article has not changed');
						return;
					}
					
					scope.articleOld = angular.copy(article);
					
					article.$update(
					function() {
						//Notification.success('article successfully updated');
						scope.isSomething = !scope.isSomething;
						
					}, 
					function(errorResponse) {
						scope.error = errorResponse.data.message;
						Notification.error(scope.error);
					});
					
				}
				
				// Make an Article Public / Private
				scope.toggleIsPublic = function() {
					scope.article.isPublic = !scope.article.isPublic;
					updateFn();
				};
				
				// Make an Article Slide / Full
				scope.toggleIsSlide = function() {
					scope.article.isSlide = !scope.article.isSlide;
					updateFn();
				};
				
				// Delete existing Article
				scope.remove = function(article) {
					/*
					scope.article.$remove(function() {
						$location.path('articles');
					});
					*/
				};
				
			}
			
		};
	});
	
};

