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
      title: 'smartKeyboard',
      state: 'app.projects.smartKeyboard',
			displayState: ['app.home'],
      type: 'standard',
			iconClass: 'fa fa-file-text-o',
      roles: ['*']
    });
		
  });

};
