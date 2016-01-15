'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('app.articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('app.articles.list', {
        url: '',
        template: '<pw-article-list></pw-article-list>'
      })
      .state('app.articles.create', {
        url: '/create',
        template: '<pw-article-create></pw-article-create>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('app.articles.view', {
        url: '/:articleId',
        template: '<pw-article-view></pw-article-view>'
      })
      .state('app.articles.edit', {
        url: '/:articleId/edit',
        template: '<pw-article-edit></pw-article-edit>',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
