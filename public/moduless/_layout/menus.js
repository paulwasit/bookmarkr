'use strict';

module.exports = function (ngModule) {
	
	ngModule.run(function(Menus) {
		
		// menuId, title, URL, type (dropdown / null), position, uiRoute (paths highlighted when active), isPublic (defaults to 0), roles (authorized users), iconClass,
		// translateKey, alert
		
		Menus.addMenuItem('sidebar', {
			title: 'Home', 
			state: 'app.home', 
			iconClass: 'fa fa-home',
			roles: ['*'],
			position: -1
		});
		
	});
	
};