/*
 * Dime - app/main.js
 */
(function ($, App) {

  App.provide('Router.Main', Backbone.Router.extend({
    el: '#area-content',
    currentRoute: undefined,
    currentView: undefined,
    initialize: function(opt) {
      // add routes
      if (opt && opt.routes) {
        for (var name in opt.routes) if (opt.routes.hasOwnProperty(name)) {
          App.log('Add route [' + opt.routes[name].route + ']', 'DEBUG');
          this.route(opt.routes[name].route, name, opt.routes[name].callback);
        }
      }

      // add element
      if (opt && opt.el) {
        this.el = opt.el;
      }
      this.$el = $(this.el);
    },
    navigate: function(fragment, options) {
      this.currentRoute = fragment;
      Backbone.history.navigate(fragment, options);
    },
    switchView: function(view) {
      if (this.currentView) {
        // Detach the old view
        this.currentView.remove();
        this.$el.addClass('loading');
      }
      this.$el.removeClass('loading');
      this.$el.html(App.template(view.template));
      view.render();
      this.currentView = view;
    }
  }));

})(jQuery, Dime);

