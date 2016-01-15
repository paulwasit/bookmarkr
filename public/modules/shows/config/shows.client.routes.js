'use strict';

// Setting up route
angular.module('shows').config(['$stateProvider',
	function($stateProvider) {

		$stateProvider
		.state('app.shows', {
			abstract: true,
			url: '/shows',
			template: '<ui-view/>'
		})
		.state('app.shows.list', {
			url: '/list',
			template: '<pw-show-list query="{inTrash: false, archived: false}"></pw-show-list>'
		})
		.state('app.shows.favs', {
			url: '/favs',
			template: '<pw-show-list query="{inTrash: false, favorite: true}"></pw-show-list>'
		})
		.state('app.shows.archived', {
			url: '/archived',
			template: '<pw-show-list query="{inTrash: false, archived: true}"></pw-show-list>'
		})
		.state('app.shows.deleted', {
			url: '/deleted',
			template: '<pw-show-list query="{inTrash: true}"></pw-show-list>'
		})
		
		.state('app.shows.add', {
			url: '/add',
      template: '<pw-show-add></pw-show-add>'
    })
		
		.state('app.shows.detail', {
			url: '/:id',
      template: '<pw-show-view></pw-show-view>'
    });		
		
	}
]);