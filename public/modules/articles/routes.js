'use strict';

module.exports = function (ngModule) {
	
	ngModule.config(function ($stateProvider) {
		
		$stateProvider
		.state('app.articles', {
			abstract: true,
			url: '/articles',
			template: '<ui-view/>'
		})
		
		// list with all possible filters
		.state('app.articles.list', {
			url: '',
			template: '<pw-article-list query="data"></pw-article-list>',
			//template: '<h1>{{data}}</h1>',
			resolve: {
				simpleObj: function(Articles){
					return Articles.query({ fields: JSON.stringify("{inTrash: false, archived: false}") });
				}
				/*
				articlesPromiseObj: function(Articles) {
					console.log("here");
					Articles.query({ fields: JSON.stringify("{inTrash: false, archived: false}") }, function(data) {
						console.log("returns");
						return data;
					});
				}
				*/
			},
			controller: function($scope, simpleObj) {
				$scope.data = simpleObj;
			}
		})
		.state('app.articles.list.favs', {
			url: '/favs',
			template: '<pw-article-list query="{inTrash: false, favorite: true}"></pw-article-list>'
		})
		.state('app.articles.list.archived', {
			url: '/archived',
			template: '<pw-article-list query="{inTrash: false, archived: true}"></pw-article-list>'
		})
		.state('app.articles.list.deleted', {
			url: '/deleted',
			template: '<pw-article-list query="{inTrash: true}"></pw-article-list>'
		})	
		
		// new article
		.state('app.articles.create', {
			url: '/create',
			template: '<pw-article-create></pw-article-create>',
			data: {
				roles: ['user', 'admin']
			}
		})
		
		// view/edit mode
		.state('app.articles.view', {
			url: '/:articleId',
			template: '<pw-article-view-edit></pw-article-view-edit>'
		});
		
	});
	
};
