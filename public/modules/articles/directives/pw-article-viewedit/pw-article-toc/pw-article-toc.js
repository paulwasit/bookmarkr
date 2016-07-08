'use strict';

module.exports = function (ngModule) {

	require('../../../../_misc/pw-ui-sref-if')(ngModule); 	          // disable click on tab headings on edit mode
	require('../../../../_misc/pw-click-outside')(ngModule);    // hide the toc when clicking outside on small screens
	var modalConfirmTemplate = require('../../../../_misc/pw-modal-confirm'); // confirm tab suppression
	var modalTemplate = require('../../../../_misc/pw-modal-template');

	ngModule.directive('pwArticleToc', function($uibModal) {
		return {
			restrict: 'EA',
			template: require('./pw-article-toc.html'),
			scope: false,
			link: function(scope, element, attrs) {
				
				/*
				// use navbar button to toggle toc
				$rootScope.$on("toggle-navbar-collapse", function (event, data) {
					scope.isAsideCollapsed = data;
				});
				*/	
				
				/* eat click if function */
				scope.isEditModeFn = function () {
					return scope.isEditMode;
				}
			
				// action on click-outside
				scope.closeThis = function () { scope.isAsideCollapsed = true; };
				
				// add a new tab
				scope.createNewTab = function () {
					var modalInstance = $uibModal.open( modalTemplate("Page Title", "New Page") );
					modalInstance.result.then(function (newTitle) {
						scope.article.content.push({title: newTitle, body: '#### New_Title\r\n\r\nNew_content'});
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
					}, function () {});	
				};
				
				// merge tabs - append after idx+1 or before idx-1
				/*
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
				*/
				
			}
		};
	});
	
};

