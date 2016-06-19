'use strict';

module.exports = function (ngModule) {
	
	var getArticles = function (params) {
		return {
			url: params.url,
			template: '<pw-article-list articles="articles"></pw-article-list>',
			resolve: {
				articles: function(Articles){
					return Articles.query({ fields: JSON.stringify(params.query) }).$promise.then(function (result) {
						return result;
					});
				}
			},
			controller: function($scope, articles) {
				$scope.articles = articles;
			}
		};
	};
	
	
	ngModule.config(function ($stateProvider) {
		
		$stateProvider
		.state('app.articles', {
			abstract: true,
			url: '/articles',
			template: '<ui-view/>'
		})
		
		.state('app.articles.list', getArticles({
			url: "",
			query: {inTrash: false, archived: false}
		}))
		.state('app.articles.favs', getArticles({
			url: "/favs", 
			query: {inTrash: false, favorite: true}
		}))
		.state('app.articles.archived', getArticles({
			url: "/archived", 
			query: {inTrash: false, archived: true}
		}))
		.state('app.articles.deleted', getArticles({
			url: "/deleted", 
			query: {inTrash: true}
		}))
		
		// view/edit mode
		.state('app.articles.view', {
			url: '/:articleId',
			template: '<pw-article-view-edit article="article"></pw-article-view-edit>',
			resolve: {
				article: function(Articles, $stateParams){
					return Articles.get({ articleId: $stateParams.articleId }).$promise.then(function (result) {
						return result;
					});
				}
			},
			controller: function($scope, article) {
				$scope.article = article;
			}
		});
		
	});
	
};