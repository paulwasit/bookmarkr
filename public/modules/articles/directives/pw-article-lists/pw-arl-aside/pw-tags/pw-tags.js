'use strict';

module.exports = function (ngModule) {

	ngModule.component('pwTags', {
		template: require('./pw-tags.html'),
		bindings: {
			tags: "=",
			selectedArticlesTags: "<"
		},
		require: {
			pwArlAside: '^^'
		},
		controller: [function () {
			
			// exposed functions
			this.selectedArticlesTagCount = selectedArticlesTagCount; // returns 1 if all selected items have the tag, 0 if mixed, nothing if none
			
			
			////////////
			
			function selectedArticlesTagCount (tag) {
				for (var i=0, len=this.selectedArticlesTags.length; i<len;i++) {
					if (this.selectedArticlesTags[i].name === tag.name) {
						return this.selectedArticlesTags[i].count;
					}
				}
				return;
			}
			
		}]
	});
};