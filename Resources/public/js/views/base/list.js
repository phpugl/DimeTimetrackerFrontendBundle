/**
 * Dime - views/service.list.js
 */
(function ($, App) {

  // provide list view in Views.Base
  App.provide('Views.Base.List', Backbone.View.extend({
    prefix: '',
    ItemView: App.Views.Base.Item,
    initialize: function(opt) {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this);
      
      // Assign function to collection events
      this.collection.on('reset', this.addAll, this);
      this.collection.on('add', this.addOne, this);
      this.collection.on('change', this.change, this);
     
      // Grep form from options

      // populate view with options
      if (opt) {
        if (opt.form) {
          this.form = opt.form;
        }
        if (opt.prefix) {
          this.prefix = opt.prefix;
        }
      }
      
      // Grep itemTagName from options
      this.itemTagName = (opt && opt.itemTagName) ? opt.itemTagName : "div";
    },
    addAll: function() {
      // remove all content
      this.$el.html('');
      // run addOne on each collection item
      this.collection.each(this.addOne);
      
      return this;
    },
    addOne: function(item) {
      // append new ItemView to element
      this.$el.append(new this.ItemView({
          model: item,
          form: this.form,
          tagName: this.itemTagName
        }).render().el
      );
        
      return this;
    },
    change: function(item) {
      // replace element html with updated item
      if (item.id != undefined) {
        $(this.prefix + item.id).replaceWith(new this.ItemView({
          model: item,
          form: this.form,
          tagName: this.itemTagName
          }).render().el
        );
      } else { // run addAll if item has no Id
        this.addAll();
      }
      return this;
    }
  }));

})(jQuery, Dime);
