/*
 * Dime - views/customer.form.js
 */

(function ($, App) {
  // customer form view
  App.provide('Views.Customer.Form', App.Views.Base.Form.extend({
    render: function() {
        // clear form
        this.form.clear();
        // fill form with model data
        this.form.fill(this.model.toJSON());
        // show bootstrap modal
        this.$el.modal('show');

        return this;
    }
  }));
})(jQuery, Dime);
