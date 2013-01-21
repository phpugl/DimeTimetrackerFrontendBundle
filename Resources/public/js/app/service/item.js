'use strict';

/**
 * Dime - views/service.item.js
 */
(function ($, App) {

  // Create item view in App.Views.Service
  App.provide('Views.Service.Item', App.Views.Core.ListItem.extend({
    events: {
      'click .edit': 'edit',
      'click .delete': 'delete',
      'click': 'showDetails'
    },
    showDetails: function() {
        this.$el.toggleClass('box-folded box-unfolded');
    },
    edit: function(e) {
        e.stopPropagation();
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
