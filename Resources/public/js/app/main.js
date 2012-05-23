/*
 * Dime - app/main.js
 */
(function ($, App) {

  // Main view
  App.provide('Views.Main', Backbone.View.extend({
    el: 'body',
    ui: {},
    events: {
      'submit #activity-track': 'trackActivity'
    },
    initialize: function() {
      App.log('Initialize main view', 'INFO');
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this);

      // find ui elements
      this.ui.activityInput = $('#activity-track-input');
    },
    trackActivity: function(e) {
      e.preventDefault();

      var data = this.ui.activityInput.val(),
          _this = this;
      if (data && data !== "") {
        this.activities.create({parse: data}, {
          wait: true,
          success: function() {
            _this.ui.activityInput.val('');
          }
        });
      }
    }
  }));

  // Router
  App.provide('Router.Main', Backbone.Router.extend({
    el: '#area-content',
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

