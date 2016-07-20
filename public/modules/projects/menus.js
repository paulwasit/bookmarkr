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
			displayState: ['app.home'],
			placement: "notCollapsed",
      type: 'standard',
			iconClass: 'fa fa-cogs',
      roles: ['*']
    });
		
		Menus.addMenuItem('topbar', {
      title: 'demo',
      state: 'app.smartKeyboard.demo',
			displayState: ['app.smartKeyboard'],
			placement: "notCollapsed",
      type: 'standard',
			iconClass: 'fa fa-cogs',
      roles: ['*'],
			position:1
    });
		
		Menus.addMenuItem('topbar', {
      title: 'overview',
      state: 'app.smartKeyboard.overview',
			displayState: ['app.smartKeyboard'],
			placement: "notCollapsed",
      type: 'standard',
			iconClass: 'fa fa-picture-o',
      roles: ['*'],
			position:2
    });
		
		Menus.addMenuItem('topbar', {
      title: 'in-depth',
      state: 'app.smartKeyboard.article',
			displayState: ['app.smartKeyboard'],
			placement: "notCollapsed",
      type: 'standard',
			iconClass: 'fa fa-file-text-o',
      roles: ['*'],
			position:3
    });
		
  });

};
