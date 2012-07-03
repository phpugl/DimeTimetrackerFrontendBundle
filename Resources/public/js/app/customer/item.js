'use strict';

/**
 * Dime - app/customer/item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Customer
  App.provide('Views.Customer.Item', App.Views.Core.ListItem.extend({
    events: {
      'click .delete': 'delete',
      'click': 'edit'
    },
    edit: function(e) {
      e.stopPropagation();
      App.UI.router.navigate('#customer/' + this.model.id + '/edit', { trigger: true });
    },
    'delete': function(e) {
      e.preventDefault();
      e.stopPropagation();

      this.model.bind('destroy', this.remove, this);

      // confirm destroy action
      if (confirm("Are you sure?")) {
        this.model.destroy({wait: true});
      }
    }
  }));
  
})(jQuery, Dime);
