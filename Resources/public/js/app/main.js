/*
 * Dime - app/main.js
 */
(function ($, App) {

  // Initialize main menu - bind on #nav-main
  App.initialize({
    name: 'navigation',
    callback: function() {
      App.UI.menu = new App.Views.Core.Menu({
        collection: App.menu(),
        attributes: {
          'class': 'nav'
        }
      });
      $('#nav-main').append(App.UI.menu.render().el);
    }
  });

})(jQuery, Dime);

