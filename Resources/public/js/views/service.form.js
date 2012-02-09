/**
 * Dime - views/service.form.js
 */
(function ($, App) {
  
  // Extend Views.Base.Form and add render function
  var SericeFormView = App.provide('Views.Service.Form', App.Views.Base.Form.extend({
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
