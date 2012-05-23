/**
 * Dime - core/views/content.js
 */
(function ($, App) {

  // Create Content view in App.Views.Core
  App.provide('Views.Core.Content', Backbone.View.extend({
    render: function() {},
    remove: function() {
      // remove element from DOM
      this.$el.empty().detach();
      
      return this;
    }
  }));
  
})(jQuery, Dime);
