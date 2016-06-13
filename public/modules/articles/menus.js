'use strict';

module.exports = function (ngModule) {
	
	ngModule.run(function(Menus) {
		
		/*
		Menu item:
		- menuId, title, URL, type (dropdown / null), position, uiRoute (paths highlighted when active), isPublic (defaults to 0), roles (authorized users), iconClass,
		- translateKey, alert

		Sub menu item: menuId, rootURL, title, URL, type, uiRoute, isPublic, roles, position, iconClass, translateKey, alert
		*/
		
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'app.articles',
			displayState: 'app.articles.list',
      type: 'dropdown',
			iconClass: 'fa fa-file-text-o',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'app.articles', {
      title: 'Articles List',
      state: 'app.articles.list',
      roles: ['*'],
			position: 1
    });

		// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'app.articles', {
			title:  'Articles Favs',
			state: 'app.articles.list.favs',
			position: 2
    });
		Menus.addSubMenuItem('topbar', 'app.articles', {
			title:  'Articles Archived',
			state: 'app.articles.list.archived',
			position: 3
    });    
		Menus.addSubMenuItem('topbar', 'app.articles', {
			title:  'Articles Deleted',
			state: 'app.articles.list.deleted',
			position: 4
    });
		
		/*
		Menus.addMenuItem('sidebar', {
			title: 'Articles', 
			state: 'app.articles', 
			type: 'dropdown',
			iconClass: 'fa fa-file-text-o',
      roles: ['*']
		});
		
		Menus.addSubMenuItem('sidebar', 'app.articles', {
			title:  'Articles List',
			state: 'app.articles.list',
      roles: ['*']
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
		*/
		
  });

};
