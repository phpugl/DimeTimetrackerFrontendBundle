/**
 * Dime - views/activity.form.js
 */

(function ($, App) {
  // activity form view
  App.provide('Views.Timeslice.Form', App.Views.Base.Form.extend({
    render: function() {
      this.form.clear();
      this.form.fill(this.model.toJSON());

      this.$el.modal('show');
      return this;
    }
  }));
})(jQuery, Dime);

