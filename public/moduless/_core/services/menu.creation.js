'use strict';

module.exports = function (ngModule) {
	
	//Menu service used for managing  menus
	ngModule.service('Menus', function() {
		
		/* ------------------------------------ constructors + prototypes ---------------------- */
		
		// default roles attributed to a menu: a user must be connected - roles = ['*'] means the menu is public, ie displayed even when no connected user
		var defaultRoles = ['user', 'admin'];
		
		// needs to be before the constructors so it is processed before them
		function shouldRender(user) {
			/*jshint validthis:true */
			if (!!~this.roles.indexOf('*')) { 
				return true;
			} 
			
			if (!user) {
				return false;
			}
			
			for (var userRoleIndex in user.roles) {
				for (var roleIndex in this.roles) {
					if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
						return true;
					}
				}
			}

			return false;
		}
		
		//menus
		function Menu(id, roles) {
			/*jshint validthis:true */
			this.items = [];
			this.roles = roles || defaultRoles;	// Define a set of default roles
		}
		
		//sub-menus 
		function MenuItem (options) {
			this.title = options.title || '';
			this.state = options.state || '';
			this.type = options.type || 'item';
			this.class = options.class;
			this.iconClass = options.iconClass || 'fa fa-file-o';
			this.roles = ((options.roles === null || typeof options.roles === 'undefined') ? defaultRoles : options.roles);
			this.position = options.position || 0;
			this.items = [];
		}
		
		Menu.prototype = { shouldRender: shouldRender	};
		MenuItem.prototype = { shouldRender: shouldRender	};

	/* 
	-- TO ADD A MENU --
	call this.addMenu ( menuID, roles )
		* menuID:   is used when adding submenus
		* roles:    the menu is displayed if the logged user's roles match the authorized roles

	-- TO ADD A MENU ITEM- -
	call this.addMenuItem ( menuID, title, URL, type, uiRoute, roles, position )
		* menuID:    the name of the top menu
		* title:     the displayed text
		* URL:       the link when clicked (relative to root path)
		* type:      'dropdown' // others. Defaults to 'item'
		** uiRoute:  indicates for which URL the menu item should be active. '/' + URL if not specified
		** roles:    see MENU above - inherits from parent menu if not specified
		** position: the menu items are ordered by position during render. Defaults to 0

	-- TO ADD A SUBITEM TO A MENU ITEM --
	call this.addSubMenuItem(menuID, rootURL, title, URL, type, uiRoute, roles, position)
		* menuID:    the name of the top menu
		* rootURL:   the URL of the parent menu item (relative to root path)
		* title:     the displayed text
		* URL:       the link when clicked (relative to root path)
		** type:     'dropdown' // others. Defaults to 'item'
		** uiRoute:  '/' + URL if not specified
		** roles:    see MENU above - inherits from parent menu if not specified
		** position: the menu items are ordered by position during render. Defaults to 0
	*/
		
	/* ------------------------------------ menus[menuID] ---------------------------------- */
		
		this.menus = {}; // Define the menus object
				
		//ADD MENU
		this.addMenu = function(menuId, roles) {
			this.menus[menuId] = new Menu(menuId, roles);
			return this.menus[menuId];
		};
		
		//GET MENU
		this.getMenu = function(menuId) {
			this.isInMenu(menuId);
			return this.menus[menuId];
		};
		
		//DELETE MENU
		this.removeMenu = function(menuId) {
			this.isInMenu(menuId);
			delete this.menus[menuId];
		};


		
	/* -------------------------- menus[menuID].items ---------------------------------------*/
		
		//ADD ITEM
		this.addMenuItem = function(menuId, options) {
			
			options = options || {};
			
			this.isInMenu(menuId);
			var parent = this.menus[menuId],
					newItem = new MenuItem(options);
			
			parent.items.push(newItem);
			return parent;

		};
		
		//ADD SUB ITEM
		// menuId, rootURL, title, URL, type, uiRoute, roles, position, iconClass, translateKey, alert
		
		this.addSubMenuItem = function(menuId, parentItemState, options) {
		
			options = options || {};
			
			this.isInMenu(menuId);
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].state === parentItemState) {
					
					var parent = this.menus[menuId].items[itemIndex];
					options.roles = (options.roles === null || typeof options.roles === 'undefined') ? parent.roles : options.roles;
					var	newItem = new MenuItem(options);
			
					parent.items.push(newItem);
				}
			}
			return this.menus[menuId];
			
		};

		//DELETE ITEM
		this.removeMenuItem = function(menuId, URL) {

			this.isInMenu(menuId);
			var menuItems = this.menus[menuId].items;
				
			for (var i=0, l=menuItems.length; i<l; i++) {
				if (menuItems[i].link === URL) {
					menuItems.splice(i, 1);
				}
			}
			return this.menus[menuId];
		
		};
			
		//DELETE SUB ITEM
		this.removeSubMenuItem = function(menuId, URL) {

			this.isInMenu(menuId);
			var menuItems = this.menus[menuId].items;
			for (var i=0, l=menuItems.length; i<l; i++) {
				var subMenuItems = menuItems[i].items;
				for (var j=0, k=subMenuItems.length; j<k; j++) {
					if (subMenuItems[j].link === URL) {
						subMenuItems.items.splice(j, 1);
					}
				}
			}
			return this.menus[menuId];
		
		};

		
		
	/* ------------------------------------ new menus mgmt --------------------------------- */
		
		this.addMenu('topbar', ['*']);
		this.addMenu('sidebar', ['*']);
		
		

		// Validate menu existence
		this.isInMenu = function(menuId) {
			if (!menuId || !menuId.length) {
				throw new Error('MenuId was not provided');
			}
			if (!this.menus[menuId]) {
				throw new Error('Menu does not exists');
			}
			return true;
		};
		
	});

};