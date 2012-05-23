/**
 * Dime - views/service.list.js
 */
(function ($, App) {

  // provide list view in Views.Base
  App.provide('Views.Base.List', Backbone.View.extend({
    defaults: {
      prefix: '',
      prependItem: false,
      itemView: App.Views.Base.Item,
      itemTagName: 'div',
      itemAttributes: {}
    },
    initialize: function(opt) {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this, 'render', 'addAll', 'addOne', 'change');
      
      // Assign function to collection events
      this.collection.on('reset', this.addAll, this);
      this.collection.on('add', this.addOne, this);
      this.collection.on('change', this.change, this);
     
      // Grep default values from option
      if (opt && opt.defaults) {
        this.defaults = _.extend({}, this.defaults, opt.defaults);
      }
    },
    render: function() {
      if (this.collection && this.collection.length > 0) {
        this.addAll();
      }
    },
    addAll: function() {
      // remove all content
      this.$el.html('').removeClass('loading');
      // run addOne on each collection item
      this.collection.each(this.addOne);
      
      return this;
    },
    addOne: function(model) {
      var item = new this.defaults.itemView({
        model: model,
        tagName: this.defaults.itemTagName,
        attributes: this.defaults.itemAttributes
      }).render().el;


      if (this.defaults.prependItem) {
        this.$el.prepend(item);
      } else {
        this.$el.append(item);
      }
        
      return this;
    },
    change: function(item) {
      // replace element html with updated item
      if (item.id != undefined) {
        $('#' + this.defaults.prefix + item.id).replaceWith(new this.defaults.itemView({
          model: item,
          tagName: this.defaults.itemTagName,
          attributes: this.defaults.itemAttributes
          }).render().el
        );
      } else { // run addAll if item has no Id
        this.addAll();
      }
      return this;
    }
  }));

})(jQuery, Dime);
