/**
 * Dime - views/activity.list.js
 */
(function ($, App) {

  // activity list view
  App.provide('Views.Activity.List', App.Views.Base.List.extend({
    el: '#activities',
    prefix: 'activity-',
    ItemView: App.Views.Activity.Item,
    addOne: function(item) {
      // append new ItemView to element
      this.$el.prepend(new this.ItemView({
          model: item,
          form: this.form,
          tagName: this.itemTagName,
          attributes: this.itemAttributes
        }).render().el
      );

      return this;
    }
  }));
  
})(jQuery, Dime);

