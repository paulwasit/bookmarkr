'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'app.admin', {
      title: 'Manage Users',
      state: 'app.admin.users'
    });
  }
]);
