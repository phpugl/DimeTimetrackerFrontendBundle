/*
 * Dime - core/view/form.js
 */
(function ($, App) {

  App.provide('Views.Core.Form', App.Views.Core.Content.extend({
    events: {
      'submit': 'save',
      'click .close': 'close',
      'click .cancel': 'close'
    },
    defaults: {
      backNavigation: ''
    },
    initialize: function(opt) {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this, 'render', 'save', 'close');

      if (opt && opt.defaults) {
        this.defaults = _.extend({}, this.defaults, opt.defaults);
      }

      this.template = this.defaults.template;
    },
    render: function() {
      this.setElement(this.defaults.templateEl);

      // Set title
      if (this.defaults.title) {
        $('h1.title', this.$el).text(this.defaults.title);
      }

      // Fill form
      this.form = this.$el.form();
      this.form.clear();
      this.form.fill(this.model.toJSON());

      return this;
    },
    save: function(e) {
      e.preventDefault();
      
      var that = this;

      this.model.save(this.form.data(), {
        success: function() {
          that.close();
          return true;
        }
      });
    },
    close: function(e) {
      App.log(this.defaults.backNavigation);
      App.UI.router.navigate(this.defaults.backNavigation, { trigger: true });
    }
  }));

  
})(jQuery, Dime);