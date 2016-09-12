'use strict';

module.exports = function (ngModule) {
	
	ngModule.run(function(Menus) {
		
		/*
		Menu item:
		- menuId, title, URL, type (dropdown / null), position, uiRoute (paths highlighted when active), isPublic (defaults to 0), roles (authorized users), iconClass,
		- translateKey, alert

		Sub menu item: menuId, rootURL, title, URL, type, uiRoute, isPublic, roles, position, iconClass, translateKey, alert
		*/
		
    // Add the smartKeyboard dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Projects',
      state: 'app.projects',
			displayState: ['app.home', 'app.articles.list', 'app.projects'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*']
    });
		
		
		// ------------------------------ ALL PROJECTS: BACK BUTTON ------------------------------ //
		
		Menus.addMenuItem('topbar', {
      title: '',
			iconClass: 'fa fa-fw fa-arrow-left',
      state: 'app.projects',
			displayState: ['app.smartKeyboard', 'app.stormReport'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*'],
			position:0
    });
		
		
		// ------------------------------ SMART KEYBOARD ------------------------------ //
		
		Menus.addMenuItem('topbar', {
      title: 'Demo',
      state: 'app.smartKeyboard.demo',
			displayState: ['app.smartKeyboard'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*'],
			position:1
    });
		
		Menus.addMenuItem('topbar', {
      title: 'Slides',
      state: 'app.smartKeyboard.overview',
			displayState: ['app.smartKeyboard'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*'],
			position:2
    });
		
		Menus.addMenuItem('topbar', {
      title: 'Article',
      state: 'app.smartKeyboard.article',
			displayState: ['app.smartKeyboard'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*'],
			position:3
    })
		
		// ------------------------------ STORM REPORT ------------------------------ //
		
		Menus.addMenuItem('topbar', {
      title: 'Demo',
      state: 'app.stormReport.demos',
			displayState: ['app.stormReport'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*'],
			position:1
    });
		
		/*Summary*/
		Menus.addMenuItem('topbar', {
      title: 'Slides',
      state: 'app.stormReport.overview',
			displayState: ['app.stormReport'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*'],
			position:2
    });
		
		Menus.addMenuItem('topbar', {
      title: 'Article',
      state: 'app.stormReport.article',
			displayState: ['app.stormReport'],
			placement: "notCollapsed",
      type: 'standard',
      roles: ['*'],
			position:3
    });
		
  });

};
