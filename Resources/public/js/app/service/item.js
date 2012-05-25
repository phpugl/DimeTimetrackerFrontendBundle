/**
 * Dime - views/service.item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Service
  App.provide('Views.Service.Item', App.Views.Base.Item.extend({
    tagName: 'div',
    template: '#tpl-service-item',
    prefix: 'service-'
  }));
})(jQuery, Dime);
