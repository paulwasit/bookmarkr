'use strict';

module.exports = function (ngModule) {

	require('./pw-article-buttons/pw-article-buttons')(ngModule); 	
	require('./pw-article-content/pw-article-content')(ngModule); 	
	require('./pw-article-toc/pw-article-toc')(ngModule); 
	
	var modalTemplate = require('../../../_misc/pw-modal-template');
	require('../../../_misc/pw-gif')(ngModule);
	
	ngModule.directive('pwArticleViewEdit', function($rootScope, $document, $uibModal, $interval, Authentication, Articles, Notification) {
		return {
			restrict: 'E',
			template: require('./pw-article-viewedit.html'),
			scope: {
				article: "="
			},
			link: function(scope, element, attrs) {
	
				// init
				scope.isAuthor = Authentication.user._id === scope.article.user._id;
				scope.article.content[0].active = true; //select the first tab by default
				scope.activeTab = scope.article.content[0];
				
				// articleOld saves the previous value of the article when running the interval save fn;
				// if no change, the server update fn is not called (limits calls to server)
				scope.articleOld = false;
				
				// toggleable values
				scope.isAsideCollapsed = true;
				scope.isEditMode = false;
				scope.isCodeMirror = true; // trigger for codemirror refresh
				scope.isFullScreen = false;
				
				scope.toggleIsFullScreen = function () {
					scope.isFullScreen = !scope.isFullScreen;
					console.log(scope.isFullScreen);
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
				scope.select = function (selectedTab, isCalledFromInside) {
					isCalledFromInside = (typeof isCalledFromInside === 'undefined') ? false : true;
					scope.isAsideCollapsed = true; /* close the toc on small screens when changing tab */
					angular.forEach(scope.article.content, function(tab) {
						if (tab.active && tab !== selectedTab) {
							tab.active = false;
							//tab.onDeselect();
							selectedTab.selectCalled = false;
						}
					});
					selectedTab.active = true;
					scope.activeTab = selectedTab;
					$rootScope.$broadcast('$locationChangeSuccess'); // allows the scrollspy to reset
					// scroll to top when click on tab title
					if (!isCalledFromInside) { 
						$document.scrollTop(450);
						$document.scrollTop(0, 300); 
						//$document.scrollTop(0); 
					} 
					// only call select if it has not already been called
					if (!selectedTab.selectCalled) {
						//selectedTab.onSelect();
						selectedTab.selectCalled = true;
					}
					scope.isCodeMirror = !scope.isCodeMirror ;
				};
				
				// reorganize tabs position
				scope.sortableConfig = {
					ghostClass: "article-toc-ghost",
					animation: 150,
					disabled: true,
					onSort: function (evt){
						scope.updateFn();
					}
				};
				
				
			// ------------------------------ SAVING THE ARTICLE ------------------------------ //	
				
				// Timer object
				scope.Timer = null;
	 
				// Timer start function.
				scope.StartTimer = function () {
					scope.Timer = $interval(scope.updateFn, 10000);
				};
	 
				// Timer stop function.
				scope.StopTimer = function () {
					if (angular.isDefined(scope.Timer)) $interval.cancel(scope.Timer);
				};
				
				// Save when leaving the page
				scope.$on("$destroy",	function () {
					if (scope.isEditMode) {
						scope.updateFn();
						scope.StopTimer();
					}
				});
				
				// Update existing Article
				scope.updateFn = function () {
					
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
						scope.isCodeMirror = !scope.isCodeMirror;
						
					}, 
					function(errorResponse) {
						scope.error = errorResponse.data.message;
						Notification.error(scope.error);
					});
					
				}
				
			}
			
		};
	});
	
};

