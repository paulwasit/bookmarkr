'use strict';

module.exports = function (ngModule) {

	require('./pw-arl-buttons/pw-arl-buttons')(ngModule); 		
	require('./pw-arl-content/pw-arl-content')(ngModule); 	
	require('./pw-arl-aside/pw-arl-aside')(ngModule); 
	
	require('~/_misc/pw-cancel-action/pw-cancel-action')(ngModule);
	
	var arrayToggle = require('~/_misc/pw-array-toggle');
		
	ngModule.component('pwArticleList', {
		template: require('./pw-article-list.html'),
		bindings: {
			articles: '='
		},
		controller: ['$location', 'Authentication', 'Articles', 'Items',
		function ($location, Authentication, Articles, Items) {
			
			var ctrl = this;
			
			// exposed functions - used by children components
			this.toggleAsideCollapsed = toggleAsideCollapsed;
			this.toggleEditMode = toggleEditMode;
			
			this.toggleTag = toggleTag;  			   // add or remove tag from this.selectedTags
			this.isTagSelected = isTagSelected;  // check if tag in this.selectedTags
			
			this.toggleArticle = toggleArticle;  			   // add or remove article from this.selectedArticles
			this.isArticleSelected = isArticleSelected;  // check if article in this.selectedArticles
			
			
			// initialize exposed variables
			this.$onInit = function () {
				
				// only the article author can modify it
				this.user = Authentication.user;
				
				// get unique tags
				this.tags = Items.getUniqueTags( this.articles );
				
				// arrays used to filter articles ( populated in the content & aside sections )
				this.selectedTags = [];
				this.selectedArticles = [];
				
				// toggleable values
				this.isAsideCollapsed = true;
				this.isEditMode = false;
				
			};
			
			
			// reset Items service when leaving the page
			this.$onDestroy = function () {
				//Items.reset();
			};
			
			
			////////////

			
			// toggle aside
			function toggleAsideCollapsed (forceTrue) { 
				this.isAsideCollapsed = (typeof(forceTrue) !== 'undefined') ? forceTrue : !this.isAsideCollapsed; 
			}
			
			// toggle edit mode
			function toggleEditMode () { 
				this.isEditMode = !this.isEditMode;
				this.selectedArticles = [];
			}
			
			// add/remove a tag & check if in array
			function toggleTag (tag)     { arrayToggle(this.selectedTags, tag);	}
			function isTagSelected (tag) { return this.selectedTags.indexOf(tag) !== -1; }
			
			// add/remove an article & check if in array
			function toggleArticle (item) { 
				if (this.isEditMode) {
					arrayToggle(this.selectedArticles, item);
					this.selectedArticles = this.selectedArticles.concat([]); // useful to trigger $watch in onchanges in aside				
				}
			}
			function isArticleSelected (item) { return this.selectedArticles.indexOf(item) !== -1; }
			
		}]
	});
};

