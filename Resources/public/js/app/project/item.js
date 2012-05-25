/**
 * Dime - app/project/item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Project
  App.provide('Views.Project.Item', App.Views.Base.Item.extend({
    tagName: 'div',
    template: '#tpl-project-item',
    prefix: 'project-'
  }));
})(jQuery, Dime);
