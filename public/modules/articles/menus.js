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
      title: 'Collections',
      state: 'articleList',
			displayState: ['app.home','app.articles.list'],
			placement: "notCollapsed",
      type: 'dropdown',
      roles: ['*']
    });
		
		// Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articleList', {
      title: 'Data Science',
      state: 'app.articles.list( { collection: "datascience" } )',
      roles: ['*'],
			position: 1
    });
    Menus.addSubMenuItem('topbar', 'articleList', {
			title:  'Algorithms',
			state: 'app.articles.list( { collection: "algorithms" } )',
			position: 2
    });
		Menus.addSubMenuItem('topbar', 'articleList', {
			title:  'JavaScript',
			state: 'app.articles.list( { collection: "javascript" } )',
			position: 3
    });    
		Menus.addSubMenuItem('topbar', 'articleList', {
			title:  'Projects',
			state: 'app.articles.list( { collection: "projects" } )',
			position: 4
    });
		Menus.addSubMenuItem('topbar', 'articleList', {
			title:  'Misc',
			state: 'app.articles.list( { collection: "misc" } )',
			position: 5
    });
		
		
		
    // Add the articles dropdown item
		/*
    Menus.addMenuItem('topbar', {
      title: 'Filter',
      state: 'filterList',
			displayState: ['app.articles.list'],
			placement: "notCollapsed",
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'filterList', {
      title: 'List',
      state: 'app.articles.list( { favs: undefined, archived: undefined, deleted: undefined } )',
      roles: ['*'],
			position: 1
    });
    Menus.addSubMenuItem('topbar', 'filterList', {
			title:  'Favs',
			state: '{ favs: true, archived: undefined, deleted: undefined }',
			position: 2
    });
		Menus.addSubMenuItem('topbar', 'filterList', {
			title:  'Archived',
			state: '{ favs: undefined, archived: true, deleted: undefined }',
			position: 3
    });    
		Menus.addSubMenuItem('topbar', 'filterList', {
			title:  'Deleted',
			state: '{ favs: undefined, archived: undefined, deleted: true }',
			position: 4
    });
		*/
		
  });

};
