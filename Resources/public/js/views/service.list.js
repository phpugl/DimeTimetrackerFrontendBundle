/**
 * Dime - views/service.list.js
 */
(function ($, App) {

  // provide Service namespace in App.Views
  App.provide('Views.Service.List', App.Views.Base.List.extend({
    el: '#services',
    prefix: 'service-',
    ItemView: App.Views.Service.Item
  }));

})(jQuery, Dime);
