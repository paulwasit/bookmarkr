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
		Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'app.articles.list',
			displayState: ['app.home'],
			placement: "notCollapsed",
      type: 'normal',
      roles: ['*']
    });
		*/
		
		Menus.addMenuItem('topbar', {
      title: 'Blog',
      state: 'app.articles.list',
			displayState: ['app.home','app.articles.list', 'app.projects', 'app.contact'],
			placement: "notCollapsed",
      type: 'normal',
      roles: ['*']
    });
		
		/*
		Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'app.articles.list',
			displayState: ['app.home','app.articles.list', 'app.projects'],
			placement: "notCollapsed",
      type: 'dropdown',
      roles: ['*']
    });
		
		// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'app.articles.list', {
      title: 'Data Science',
      state: 'app.articles.list( { collection: "datascience", favs: undefined, archived: undefined, deleted: undefined, ispublic: undefined } )',
      roles: ['*'],
			position: 1
    });
    Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Algorithms',
			state: 'app.articles.list( { collection: "algorithms", favs: undefined, archived: undefined, deleted: undefined, ispublic: undefined } )',
			position: 2
    });
		Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'JavaScript',
			state: 'app.articles.list( { collection: "javascript", favs: undefined, archived: undefined, deleted: undefined, ispublic: undefined } )',
			position: 3
    });    
		Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Projects',
			state: 'app.articles.list( { collection: "projects", favs: undefined, archived: undefined, deleted: undefined, ispublic: undefined } )',
			position: 4
    });
		Menus.addSubMenuItem('topbar', 'app.articles.list', {
			title:  'Misc',
			state: 'app.articles.list( { collection: "misc", favs: undefined, archived: undefined, deleted: undefined, ispublic: undefined } )',
			position: 5
    });
		*/
  });

};
