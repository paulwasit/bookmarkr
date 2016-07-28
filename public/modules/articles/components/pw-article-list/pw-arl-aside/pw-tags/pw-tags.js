'use strict';

module.exports = function (ngModule) {

	var modalTemplate = require('~/_misc/pw-modal-template');
	require('~/_misc/pw-ui-sref-if')(ngModule); 	    // disable click when no selected articles
	
	ngModule.component('pwTags', {
		template: require('./pw-tags.html'),
		bindings: {
			tags: "<",
			selectedArticlesTags: "<"
		},
		require: {
			pwArlAside: '^^'
		},
		controller: ['$uibModal', function ($uibModal) {
			
			var ctrl = this;
			
			// exposed functions
			this.selectedArticlesTagCount = selectedArticlesTagCount; // returns 1 if all selected items have the tag, 0 if mixed, nothing if none
			this.createNewTag = createNewTag;
			
			////////////
			
			function selectedArticlesTagCount (tag) {
				for (var i=0, len=this.selectedArticlesTags.length; i<len;i++) {
					if (this.selectedArticlesTags[i].name === tag.name) {
						return this.selectedArticlesTags[i].newCount;
					}
				}
				return;
			}
			
			// add a new tag
			function createNewTag () {
				var modalInstance = $uibModal.open( modalTemplate("Tage Title", "New Tag") );
				modalInstance.result.then(function (newTitle) {
					ctrl.tags.push({ name: newTitle, count: 0 });
				}, function () {});	
				
			}
			
		}]
	});
};