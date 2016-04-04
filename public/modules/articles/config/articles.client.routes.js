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
        template: '<pw-article-view-edit></pw-article-view-edit>'
      });
  }
]);
