'use strict';

module.exports = function (ngModule) {
	
	var getArticles = function (url) {
		return {
			url: url,
			template: '<pw-article-list articles="articles"></pw-article-list>',
			resolve: {
				articles: ["Articles", "Items", "$stateParams", function( Articles, Items, $stateParams ){
					
					// by default: archived = false, inTrash = false
					var query = { 
						collectionTag: $stateParams.collection || undefined, // collection has to be indicated
						archived: false,
						inTrash: false
					};
					
					if ( typeof $stateParams.favs !== "undefined" )     query.favorite = ($stateParams.favs === "false")     ? false : true;
					if ( typeof $stateParams.archived !== "undefined" ) query.archived = ($stateParams.archived === "false") ? false : true;
					if ( typeof $stateParams.deleted !== "undefined" )  query.inTrash  = ($stateParams.inTrash === "false")  ? false : true;
					if ( typeof $stateParams.ispublic !== "undefined" )  query.isPublic  = ($stateParams.isPublic === "false")  ? false : true;
					
					return Articles.query({ fields: JSON.stringify(query) }).$promise.then(function (result) {
						return result;
					});
				}]
			},
			controller: ["$scope", "articles", function($scope, articles) {
				$scope.articles = articles;
			}]
		};
	},
	
	setParams = function(url, query) {
		var params = {
			url: url,	
			query: query
		};
		//params.query.collectionTag = collectionTag;
		return params;
	};
	
	
	ngModule.config(function ($stateProvider) {
		
		
		/* --------------- OTHERS ------------------- */
		
		$stateProvider
		.state('app.articles', {
			abstract: true,
			url: '/blog',
			template: '<ui-view/>'
		})

		//.state('app.articles.list', getArticles( "?collection&favs&archived&deleted&ispublic" ))
		.state('app.articles.list', getArticles( "?favs&archived&deleted&ispublic" ))
		
		// view/edit mode
		.state('app.articles.view', {
			url: '/:articleId',
			template: '<pw-article-view article="article" related="related"></pw-article-view>',
			resolve: {
				article: ["Articles", "$stateParams", function(Articles, $stateParams){
					return Articles.get({ articleId: $stateParams.articleId }).$promise.then(function (result) {
						return result;
					});
				}]
			},
			controller: ["$scope", "article", function($scope, article) {
				$scope.article = article.article;
				$scope.related = article.related;
			}]
		});
		
	});
	
};