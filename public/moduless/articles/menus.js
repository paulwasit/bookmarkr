'use strict';

module.exports = function (ngModule) {
	
	ngModule.run(function(Menus) {
		
		/*
		Menu item:
		- menuId, title, URL, type (dropdown / null), position, uiRoute (paths highlighted when active), isPublic (defaults to 0), roles (authorized users), iconClass,
		- translateKey, alert

		Sub menu item: menuId, rootURL, title, URL, type, uiRoute, isPublic, roles, position, iconClass, translateKey, alert
		*/
		
		/*
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'app.articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'app.articles', {
      title: 'List Articles',
      state: 'app.articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'app.articles', {
      title: 'Create Articles',
      state: 'app.articles.create',
      roles: ['user']
    });
		*/
		
		Menus.addMenuItem('sidebar', {
			title: 'Articles', 
			state: 'app.articles', 
			type: 'dropdown',
			iconClass: 'fa fa-file-text-o'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.articles', {
			title:  'Articles List',
			state: 'app.articles.list'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.articles', {
			title:  'Articles Favs',
			state: 'app.articles.favs'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.articles', {
			title:  'Articles Archived',
			state: 'app.articles.archived'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.articles', {
			title:  'Articles Deleted',
			state: 'app.articles.deleted'
		});
		
		Menus.addSubMenuItem('sidebar', 'app.articles', { 
			title:  'Create New Article',
			state: 'app.articles.create'
		});
		
  });

};
