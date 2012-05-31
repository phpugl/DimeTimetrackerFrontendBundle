/**
 * Dime - app/activity/form.js
 */
(function ($, App) {

  // Activity form view
  App.provide('Views.Activity.Form', App.Views.Core.Form.extend({
    render: function() {
      this.setElement(this.defaults.templateEl);

      App.session('current.model', this.model);
      
      // Set title
      if (this.defaults.title) {
        $('h1.title', this.$el).text(this.defaults.title);
      }

      // Fill form
      this.form = this.$el.form();
      this.form.clear();
      this.form.fill(this.model.toJSON());

      var customers = new App.Collection.Customers();
      var selectBox = new App.Views.Base.Select({
        el: this.form.get('customer'),
        collection: customers,
        defaults: {
          selected: this.model.get('customer')
        }
      });
      customers.fetch();

      var services  = new App.Collection.Services();
      selectBox = new App.Views.Base.Select({
        el: this.form.get('service'),
        collection: services,
        defaults: {
          selected: this.model.get('service')
        }
      });
      services.fetch();

      // Render select box for project
      var projects  = new App.Collection.Projects();
      selectBox = new App.Views.Base.Select({
        el: this.form.get('project'),
        collection: projects,
        defaults: {
          selected: this.model.get('project')
        }
      });
      projects.fetch();

      // Render timeslices
      if (this.model.relation('timeslices')) {
        this.activityList = new App.Views.Core.List({
          el: '#tab-timeslices',
          template: '#tpl-timeslices',
          templateEl: '#timeslices',
          model: this.model,
          collection: this.model.relation('timeslices'),
          defaults: {
            prefix: 'timeslice-',

            item: {
              attributes: { "class": "timeslice" },
              prepend: true,
              tagName: "tr",
              View: App.Views.Timeslice.Item
            }
          }
        }).render();
      } else {
        $('a[href="#tab-timeslices"]',this.$el).remove();
      }
      
      
      return this;
    }
  }));

})(jQuery, Dime);