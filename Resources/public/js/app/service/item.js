/**
 * Dime - views/service.item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Service
  App.provide('Views.Service.Item', App.Views.Core.ListItem.extend({
    events: {
      'click .delete': 'delete'
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
