'use strict';

// Configuring the Articles module
angular.module('layout').run(['Menus',
	function(Menus) {
		
		// menuId, title, URL, type (dropdown / null), position, uiRoute (paths highlighted when active), isPublic (defaults to 0), roles (authorized users), iconClass,
		// translateKey, alert
		
		Menus.addMenuItem('sidebar', {
			title: 'Home', 
			state: 'app.home', 
			iconClass: 'fa fa-home',
			roles: ['*'],
			position: -1
		});
		
	}
]);