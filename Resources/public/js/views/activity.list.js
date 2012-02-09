/**
 * Dime - views/activity.list.js
 */
(function ($, App) {

  // activity list view
  App.provide('Views.Activity.List', App.Views.Base.List.extend({
    el: '#activities',
    prefix: 'activity-',
    ItemView: App.Views.Activity.Item
  }));
  
})(jQuery, Dime);

