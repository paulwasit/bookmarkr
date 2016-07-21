'use strict';

var pwArrayToggle = require('../../../../../_misc/pw-array-toggle');

module.exports = function (ngModule) {
	
	require('../../../../../_misc/pw-cancel-action/pw-cancel-action')(ngModule);
	
	ngModule.directive('pwTagItem', function(Articles, Items) {
		return {
			restrict: 'AE',
			template: require('./pw-tag-item.html'),
			scope: {
				tag: '=',
			},
			require: '^pwArticleList',
			link: function(scope, element, attrs, pwArticleListCtrl) { 
				
				// we check if the user has selected items for edit
				scope.isEditMode = function () {
					return Items.isEditMode();
				};
				
				// if no item is selected for edit, the user can toggle tags
				// for filtering items (inActiveTags is used for CSS)
				
				scope.toggleActiveTag = function() { 
					pwArrayToggle(pwArticleListCtrl.activeTags, scope.tag.name);
				};
				
				scope.inActiveTags = function() { 
					return pwArticleListCtrl.activeTags.indexOf(scope.tag.name) !== -1;
				};
				
				
				// if items are selected for edit, the user can add/remove tags
				// to all the selected items (inSelectedTags is used for CSS)
				
				scope.inSelectedTags = function () {
					return Items.isInEditTags(scope.tag.name);
				};
				
				scope.toggleSelectedTag = function (callback) {
					Items.toggleTag(scope.tag.name);
					if (callback !== undefined) {return callback();}
				};
				
				scope.clientUpdate = function (field) {
					// evalAsync: wait until the end of the current digest cycle to fire, so the previous cancel action has time to be complete
					scope.$evalAsync(function() {
						scope.toggleSelectedTag(function () {
							return Items.clientUpdate(field);
						});
					});
				};
				
				scope.serverUpdate = function (field) {
					var params = Items.serverUpdateParams(field);
					//dbService.update(params.query, params.body);
					Articles.update(params.query, params.body);
				};
				
				scope.cancelUpdate = function () {
					return Items.cancelUpdate();
				};
				
				
			}

		};
	});
	
};