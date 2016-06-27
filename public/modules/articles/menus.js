'use strict';

module.exports = function (ngModule) {
	
	ngModule.run(function(Menus) {
		
		/*
		Menu item:
		- menuId, title, URL, type (dropdown / null), position, uiRoute (paths highlighted when active), isPublic (defaults to 0), roles (authorized users), iconClass,
		- translateKey, alert

		Sub menu item: menuId, rootURL, title, URL, type, uiRoute, isPublic, roles, position, iconClass, translateKey, alert
		*/
		
		Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'app.articles.list',
			displayState: ['app.home'],
			placement: "notCollapsed",
      type: 'normal',
      roles: ['*']
    });
		
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Filter',
      state: 'app.articles.list',
			displayState: ['app.articles.list','app.articles.favs','app.articles.archived','app.articles.deleted'],
			placement: "notCollapsed",
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'app.articles.list', {
      title: 'Articles List',
      state: 'app.articles.list',
      roles: ['*'],
			position: 1
    });
    Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Articles Favs',
			state: 'app.articles.favs',
			position: 2
    });
		Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Articles Archived',
			state: 'app.articles.archived',
			position: 3
    });    
		Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Articles Deleted',
			state: 'app.articles.deleted',
			position: 4
    });
		
  });

};
