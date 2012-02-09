/**
 * Dime - views/project.item.js
 */
(function ($, App) {

  // provide form view in App.Views.Project
  App.provide('Views.Project.Form', App.Views.Base.Form.extend({
    render: function() {
      // clean up form
      this.form.clear();
      // fill form with model data
      this.form.fill(this.model.toJSON());

      // get Customers collection
      var customers = new App.Collection.Customers;
      // create select view
      var selectBox = new App.Views.Base.Select({
        el: this.form.get('customer'),
        collection: customers,
        selected: this.model.get('customer')
      });
      // fetch data
      customers.fetch();

      // show bootstrap modal
      this.$el.modal('show');

      return this;
    }
  }));

})(jQuery, Dime);
