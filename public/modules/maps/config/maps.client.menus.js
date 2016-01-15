'use strict';

// Configuring the Chat module
angular.module('maps').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('sidebar', {
			title: 'Maps', 
			state: 'app.maps',
			iconClass: 'fa fa-map-marker'
		});
  }
]);
