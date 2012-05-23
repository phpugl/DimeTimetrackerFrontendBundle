/**
 * Dime - views/activity.form.js
 */

(function ($, App) {
  // activity form view
  App.provide('Views.Activity.Form', App.Views.Base.Form.extend({
    render: function() {
      this.form.clear();
      this.form.fill(this.model.toJSON());
      App.log(this.model);

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

      var projects  = new App.Collection.Projects();
      selectBox = new App.Views.Base.Select({
        el: this.form.get('project'),
        collection: projects,
        defaults: {
          selected: this.model.get('project')
        }
      });
      projects.fetch();

      this.$el.modal('show');
      return this;
    }
  }));
})(jQuery, Dime);

