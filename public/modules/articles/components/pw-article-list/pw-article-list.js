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
		controller: ['$timeout', '$location', '$stateParams', '$state', 'Authentication', 'Articles', 'Items', 'Notification', 'isTagInFilter',
		function ($timeout, $location, $stateParams, $state, Authentication, Articles, Items, Notification, isTagInFilter) {
			
			var ctrl = this,
					oldArticles = [],
					oldSelectedArticles = []; // used when cancelling update
			
			// exposed functions - used by children components
			this.toggleAsideCollapsed = toggleAsideCollapsed;
			this.toggleEditMode = toggleEditMode;
			this.toggleCollection = toggleCollection;
			// filter by tag
			this.toggleTag = toggleTag;  			   // add or remove tag from this.selectedTags
			this.isTagSelected = isTagSelected;  // check if tag in this.selectedTags
			// select articles for update
			this.toggleArticle = toggleArticle;  			   // add or remove article from this.selectedArticles
			this.isArticleSelected = isArticleSelected;  // check if article in this.selectedArticles
			// update functions
			this.clientUpdate = clientUpdate;
			this.cancelUpdate = cancelUpdate;
			this.serverUpdate = serverUpdate;
			
			// initialize exposed variables
			this.$onInit = function () {
				
				// only the article author can modify it
				this.user = Authentication.user;
				
				// get unique tags
				this.tags = Items.getUniqueTags( this.articles );
				
				// arrays used to filter articles ( populated in the content & aside sections )
				this.selectedTags = [];
				this.filteredArticles = isTagInFilter(this.articles, this.selectedTags);
				
				// selected articles in edit mode
				this.selectedArticles = [];
				
				// toggleable values
				this.isAsideCollapsed = true;
				this.isEditMode = false;
				
				// update
				this.editValues = {
					query: {},
					tags: {}
				};
				
			};
			
			
			// reset Items service when leaving the page
			this.$onDestroy = function () {
				//Items.reset();
			};
			
			
			////////////

			function toggleAsideCollapsed (forceTrue) { 
				this.isAsideCollapsed = (typeof(forceTrue) !== 'undefined') ? forceTrue : !this.isAsideCollapsed; 
			}
			
			function toggleEditMode () { 
				this.isEditMode = !this.isEditMode;
				this.selectedArticles = [];
				this.tags = Items.getUniqueTags( this.articles ); // update the tags count, if modified during update
			}
			
			function toggleCollection (collection) { 
				if ($stateParams.collection === collection) {
					$state.go( 'app.articles.list', { collection: undefined } );
					//app.articles.list({ 'collection: undefined' });
				}
				else {
					$state.go( 'app.articles.list', { collection: collection } );
				}
			}
			
			function toggleTag (tag)     { 
				arrayToggle(this.selectedTags, tag);	
				this.filteredArticles = isTagInFilter(this.articles, this.selectedTags);
			}
			function isTagSelected (tag) { return this.selectedTags.indexOf(tag) !== -1; }
			
			function toggleArticle (item) { 
				if (this.isEditMode) {
					// if update currently running, wait until server fn has been called to fire
					$timeout(function() {
						arrayToggle(ctrl.selectedArticles, item._id);
						ctrl.editValues = Items.updateQueryValues(ctrl.articles, ctrl.selectedArticles);
						ctrl.selectedArticles = ctrl.selectedArticles.concat([]); // useful to trigger $watch in onchanges in children
					});						
				}
			}
			function isArticleSelected (item) { return this.selectedArticles.indexOf(item._id) !== -1; }
			
			
			////////////
			// $timeout runs a digest cycle after articles update, so the children views are updated
			
			function clientUpdate (field, newValue) {
				this.toggleAsideCollapsed(true);
				// test if relevant
				if (this.selectedArticles.length === 0)	return;
				// save old values
				oldArticles = angular.copy(this.articles);
				oldSelectedArticles = angular.copy(this.selectedArticles);
				// update edit tags when a tag is toggled by the user
				if (field === "tags") {
					this.editValues.tags = Items.toggleTag(this.editValues.tags, newValue);
				}
				var newValue = 
						(field === "tags") ? this.editValues.tags : 
						(field === "collectionTag") ? newValue : this.editValues.query[field];
				$timeout(function() {
					ctrl.articles = Items.updateAngularItems (ctrl.articles, ctrl.selectedArticles, field, newValue);
					ctrl.editValues.query = Items.updateQueryValues(ctrl.articles, ctrl.selectedArticles).query; // changes the selected field boolean value
					ctrl.selectedArticles = [];
					//ctrl.tags = Items.getUniqueTags( ctrl.articles );
				});
			}
			
			function cancelUpdate () {
				$timeout(function() {
					ctrl.articles = angular.copy(oldArticles);
					ctrl.selectedArticles = angular.copy(oldSelectedArticles);
					ctrl.editValues = Items.updateQueryValues(ctrl.articles, ctrl.selectedArticles);
					// reset update values
					oldArticles = [];
					oldSelectedArticles = [];
					//ctrl.tags = Items.getUniqueTags( ctrl.articles );
				});
			}
			
			function serverUpdate (field, newValue) {
				// get db query params
				var params = Items.serverUpdateParams(oldSelectedArticles, this.editValues, field, newValue);
				// reset update values
				oldArticles = [];
				oldSelectedArticles = [];
				this.editValues = {
					query: {},
					tags: {}
				};
				// update db
				Articles.update(params.query, params.body, 
				function() {
					//Notification.success('article successfully updated');
				}, 
				function(errorResponse) {
					var error = errorResponse.data.message;
					Notification.error(error);
				});
			}
			
		}]
	});
};

