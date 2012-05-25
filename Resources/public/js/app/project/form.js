/**
 * Dime - app/project/form.js
 */
(function ($, App) {

  App.provide('Views.Project.Form', App.Views.Core.Form.extend({
    render: function() {
      this.setElement(this.defaults.templateEl);

      // Set title
      $('h1.title', this.$el).text(this.defaults.title);

      // Fill form
      this.form = this.$el.form();
      this.form.clear();
      this.form.fill(this.model.toJSON());

      // get Customers collection
      var customers = new App.Collection.Customers();
      var selectBox = new App.Views.Base.Select({
        el: this.form.get('customer'),
        collection: customers,
        defaults: {
          selected: this.model.get('customer')
        }
      });
      customers.fetch();
      
      return this;
    }
  }));

})(jQuery, Dime);