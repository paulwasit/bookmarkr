'use strict';

module.exports = function (ngModule) {

	require('../../../_misc/pw-focus-me')(ngModule);	
	require('../../../_misc/pw-in-header')(ngModule);	
	require('../../assets/highlightjs/styles/github.css');
	
	
	ngModule.directive('pwArticleViewEdit', function($stateParams, $location, $document, $uibModal, $interval, Authentication, Articles, Notification) {
		return {
			restrict: 'E',
			template: require('./pw-article-viewedit.html'),
			scope: {},
			link: function(scope, element, attrs) {
				
				// authentication
				scope.authentication = Authentication;
				
				scope.article = Articles.get({ articleId: $stateParams.articleId }, function () {
					/*
					if ((scope.article.user === scope.authentication.user) || scope.article.isPublic === true) {
						
					}
					*/
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
					if (idx === scope.article.content.length) {
						scope.select(scope.article.content[idx-1])
					}
					scope.update(false); 
				};
				
				// move tabs up & down
				scope.moveTabs = function (tab, direction) {
					var idx = scope.article.content.indexOf(tab),
							newContent = angular.copy(scope.article.content);
					if (idx === -1) return;
					newContent.splice(idx, 1);
					if (direction === 'up') {
						newContent.splice(idx-1, 0, tab);
					}
					else {
						newContent.splice(idx+1, 0, tab);
					}
					scope.article.content = newContent;
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
				
				scope.items = ['item1', 'item2', 'item3'];
				
				// Rename Tab
				scope.renameTab = function (tab) {
					var idx = scope.article.content.indexOf(tab);
					if (idx === -1) return;
					//scope.article.content[idx].title = newTitle;
					var modalInstance = $uibModal.open({
						animation: false,
						template: 
							'<div class="modal-body">' +
								'<div class="form-group">' +
									'<label>Tab Title:</label>' +
									'<input type="text" ng-model="newTitle" class="form-control">' +
								'</div>' +
							'</div>' +
							'<div class="modal-footer">' +
								'<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>' +
								'<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
							'</div>',
						controller: function ($scope, $uibModalInstance, title) {
							$scope.newTitle = title;
							$scope.ok = function () {
								$uibModalInstance.close($scope.newTitle);
							};
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						},
						size: 'sm',
						resolve: {
							title: function () {
								return tab.title;
							}
						}
					});
					modalInstance.result.then(function (newTitle) {
						tab.title = newTitle;
					}, function () {});

				};
				
				// Rename Tab
				scope.renameTitle = function () {
					var modalInstance = $uibModal.open({
						animation: false,
						template: 
							'<div class="modal-body">' +
								'<div class="form-group">' +
									'<label>Article Title:</label>' +
									'<input type="text" ng-model="newTitle" class="form-control">' +
								'</div>' +
							'</div>' +
							'<div class="modal-footer">' +
								'<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>' +
								'<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>' +
							'</div>',
						controller: function ($scope, $uibModalInstance, title) {
							$scope.newTitle = title;
							$scope.ok = function () {
								$uibModalInstance.close($scope.newTitle);
							};
							$scope.cancel = function () {
								$uibModalInstance.dismiss('cancel');
							};
						},
						size: 'sm',
						resolve: {
							title: function () {
								return scope.article.title;
							}
						}
					});
					modalInstance.result.then(function (newTitle) {
						scope.article.title = newTitle;
					}, function () {});

				};
				
				// Toggle edit mode
				scope.disableEdit = true;
				/*document.getElementById('editableTitle').contentEditable='false';*/
				
				scope.toggleEditMode = function () {
					scope.disableEdit = !scope.disableEdit;
					if (!scope.disableEdit) {
						scope.StartTimer();
					}
					else {
						updateFn();
						scope.StopTimer();
					}
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
					
					// deep copy to prevent flickering
					var article = angular.copy(scope.article);
					//var article = scope.article;
					
					article.$update(
					function() {
						Notification.success('article successfully updated');
						scope.isSomething = !scope.isSomething;
						
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