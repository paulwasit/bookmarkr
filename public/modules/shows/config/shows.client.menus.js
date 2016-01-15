'use strict';

// Configuring the Articles module
angular.module('shows').run(['Menus',
	function(Menus) {
		
		/*
		Menu item:
		- menuId, title, URL, type (dropdown / null), position, uiRoute (paths highlighted when active), isPublic (defaults to 0), roles (authorized users), iconClass,
		- translateKey, alert

		Sub menu item: menuId, rootURL, title, URL, type, uiRoute, isPublic, roles, position, iconClass, translateKey, alert
		*/
		
		
		// sidebar
		Menus.addMenuItem('sidebar', {
			title: 'Shows', 
			state: 'app.shows', 
			type: 'dropdown',
			iconClass: 'fa fa-anchor'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.shows', {
			title:  'Shows List',
			state: 'app.shows.list'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.shows', {
			title:  'Shows Favs',
			state: 'app.shows.favs'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.shows', {
			title:  'Shows Archived',
			state: 'app.shows.archived'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.shows', {
			title:  'Shows Deleted',
			state: 'app.shows.deleted'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.shows', { 
			title:  'Add New Show',
			state: 'app.shows.add'
		});
		
	}
]);