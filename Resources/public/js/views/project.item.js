/**
 * Dime - views/project.item.js
 */
(function ($, App) {

  // provide item view in App.Views.Service
  App.provide('Views.Project.Item', App.Views.Base.Item.extend({
    tagName: 'div',
    prefix: 'project-',
    template: '#tpl-project-item'
  }));
})(jQuery, Dime);
