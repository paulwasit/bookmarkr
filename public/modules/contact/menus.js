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
      title: 'Contact',
      state: 'app.contact',
			displayState: ['app.home', 'app.bad-request', 'app.forbidden', 'app.not-found', 'app.articles.list', 'app.projects', 'app.contact'],
			placement: "notCollapsedRight",
      type: 'standard',
      roles: ['*']
    });
		
  });

};
