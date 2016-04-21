'use strict';

module.exports = function (ngModule) {
	
	ngModule.run(function(Menus) {
		
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'app.articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'app.articles', {
      title: 'List Articles',
      state: 'app.articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'app.articles', {
      title: 'Create Articles',
      state: 'app.articles.create',
      roles: ['user']
    });
		
  });

};
