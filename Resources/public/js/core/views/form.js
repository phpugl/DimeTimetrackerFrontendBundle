/*
 * Dime - core/view/form.js
 */
(function ($, App) {

  App.provide('Views.Core.Form', App.Views.Core.Content.extend({
    events: {
      'submit form': 'save',
      'click .save': 'save',
      'click .close': 'close',
      'click .cancel': 'close'
    },
    defaults: {
      backNavigation: ''
    },
    initialize: function(opt) {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this);

      if (opt && opt.defaults) {
        this.defaults = _.extend({}, this.defaults, opt.defaults);
      }

      if (this.defaults.template) {
        this.template = this.defaults.template;
      }
    },
    render: function() {
      this.setElement(this.defaults.templateEl, true);

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
        wait: true,
        success: function() {
          that.close();
        },
        error: function(model, response, scope) {
          App.log(response, 'ERROR');
        }
      });
    },
    close: function() {
      App.UI.router.navigate(this.defaults.backNavigation, { trigger: true });
    }
  }));


})(jQuery, Dime);