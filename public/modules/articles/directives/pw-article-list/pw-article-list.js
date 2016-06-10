'use strict';

module.exports = function (ngModule) {
	
	//var Items = require('../../../items/items.service')(ngModule);
	require('./pw-card/pw-card-list')(ngModule);
	require('./pw-card/pw-card-item')(ngModule);
	require('./pw-category/pw-category-list')(ngModule);
	require('./pw-category/pw-category-item')(ngModule);
	
	ngModule.directive('pwArticleList', function($location, $uibModal, Articles, Items) {
		
		return {
			restrict: 'E',
			template: require('./pw-article-list.html'),
			scope: {
				query: '=' // the query is defined in ../config/routes to handle the display options (fav, trash, ...)
			},
			link: function(scope, element, attrs) {
				
				scope.createItem = function() {
	
					var modalInstance = $uibModal.open({
						animation: false,
						template: 
							'<div class="modal-body">' +
								'<div class="form-group">' +
									'<label>Title:</label>' +
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
								return 'Title';
							}
						}
					});
					modalInstance.result.then(function (newTitle) {
						
						var article = new Articles({
							title: newTitle,
							content: [{body: 'start typing here'}]
						});

						article.$save(
						function(response) {
							$location.path('articles/' + response._id);
						},
						function(errorResponse) {
							scope.error = errorResponse.data.message;
						});
						
						
					}, function () {});
				
				
				
				
					
				};
				
			},
			controller: ['$scope', function($scope) {
				
				// we get articles based on the query params then build the tags array
				$scope.articles = Articles.query({ fields: JSON.stringify($scope.query) }, function () {
				
					// we store tags in an array of objects {name: tagName, count: tagCount}
					$scope.tags = Items.getUniqueTags ($scope.articles, 'tags');
					return Items.getItems ($scope.articles);
					
				});
				
				// arrays used to filter articles. populated both in the card list & the tag list directives
				this.activeTags = [];
				
				$scope.$on('itemsUpdate', function(event, items) {
					$scope.$evalAsync(function() {
						$scope.articles = items;
						$scope.tags = Items.getUniqueTags ($scope.articles, 'tags');
					});
				});
		
				$scope.$on('$destroy', function() {
					return Items.reset();
				});
				
			}],
			controllerAs: 'ctrl'
			
		};
		
	});

};