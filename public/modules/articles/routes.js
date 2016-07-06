'use strict';

module.exports = function (ngModule) {
	
	var getArticles = function (url) {
		return {
			url: url,
			template: '<pw-article-list articles="articles"></pw-article-list>',
			resolve: {
				articles: ["Articles", "Items", "$stateParams", function( Articles, Items, $stateParams ){
					
					console.log($stateParams);
					
					// by default: archived = false, inTrash = false
					var query = { 
						collectionTag: $stateParams.collection || undefined, // collection has to be indicated
						archived: false,
						inTrash: false
					};
					
					if ( typeof $stateParams.favs !== "undefined" )     query.favorite = ($stateParams.favs === "false")     ? false : true;
					if ( typeof $stateParams.archived !== "undefined" ) query.archived = ($stateParams.archived === "false") ? false : true;
					if ( typeof $stateParams.deleted !== "undefined" )  query.inTrash  = ($stateParams.inTrash === "false")  ? false : true;
					
					Items.setListQuery( $stateParams ); // used for the "back" button in pw-article-viewedit
					
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
			url: '/articles',
			template: '<ui-view/>'
		})
		
		/* JS */
		/*
		.state('app.articles.listJS',     getArticles( setParams( "JavaScript", "/JS",          { inTrash: false, archived: false } ))) 
		.state('app.articles.favsJS',     getArticles( setParams( "JavaScript", "/JS/favs",     { inTrash: false, favorite: true }  )))
		.state('app.articles.archivedJS', getArticles( setParams( "JavaScript", "/JS/archived", { inTrash: false, archived: true }  )))
		.state('app.articles.deletedJS',  getArticles( setParams( "JavaScript", "/JS/deleted",  { inTrash: true } )))
		*/
		
		/*
		.state('app.articles.list',     getArticles( setParams( "/:collectionTag",          { inTrash: false, archived: false } ))) // show fav & non favs
		.state('app.articles.favs',     getArticles( setParams( "/favs/:collectionTag",     { inTrash: false, favorite: true }  ))) // show fav only
		.state('app.articles.archived', getArticles( setParams( "/archived/:collectionTag", { inTrash: false, archived: true }  ))) // show archived fav & non favs
		.state('app.articles.deleted',  getArticles( setParams( "/deleted/:collectionTag",  { inTrash: true } )))
		*/
		
		/* misc */
	.state('app.articles.list', getArticles( "?collection&favs&archived&deleted" ))
	
		/*
		.state('app.articles.list', getArticles({
			url: "/list?collection?favs?archived?deleted",
			query: {inTrash: false, archived: false}
		}))
		*/
		/*
		.state('app.articles.favs', getArticles({
			url: "/lists?favs", 
			query: {inTrash: false, favorite: true}
		}))
		.state('app.articles.list.archived', getArticles({
			url: "?archived", 
			query: {inTrash: false, archived: true}
		}))
		.state('app.articles.list.deleted', getArticles({
			url: "?deleted", 
			query: {inTrash: true}
		}))
		*/
		
		
		
		// view/edit mode
		.state('app.articles.view', {
			url: '/:articleId',
			template: '<pw-article-view-edit article="article"></pw-article-view-edit>',
			resolve: {
				article: ["Articles", "$stateParams", function(Articles, $stateParams){
					return Articles.get({ articleId: $stateParams.articleId }).$promise.then(function (result) {
						return result;
					});
				}]
			},
			controller: ["$scope", "article", function($scope, article) {
				$scope.article = article;
			}]
		});
		
	});
	
};