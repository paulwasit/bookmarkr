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
			displayState: ['app.articles.list'],
			placement: "notCollapsed",
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'app.articles.list', {
      title: 'List',
      state: 'app.articles.list( { favs: undefined, archived: undefined, deleted: undefined } )',
      roles: ['*'],
			position: 1
    });
    Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Favs',
			state: '{ favs: true, archived: undefined, deleted: undefined }',
			position: 2
    });
		Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Archived',
			state: '{ favs: undefined, archived: true, deleted: undefined }',
			position: 3
    });    
		Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Deleted',
			state: '{ favs: undefined, archived: undefined, deleted: true }',
			position: 4
    });
		
  });

};
