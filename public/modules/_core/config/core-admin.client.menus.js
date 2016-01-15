'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'app.admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);
