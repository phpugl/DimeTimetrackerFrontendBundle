/**
 * Dime - app/service/form.js
 */
(function ($, App) {

  App.provide('Views.User.Form', App.Views.Core.Form.extend({
    events: {
      'click .save': 'save',
      'click .close': 'close',
      'click .cancel': 'close'
    }
  }));

})(jQuery, Dime);