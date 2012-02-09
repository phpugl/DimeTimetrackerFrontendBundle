/**
 * Dime - views/service.list.js
 */
(function ($, App) {

  // provide Service namespace in App.Views
  var SericeListView = App.provide('Views.Service.List', Backbone.View.extend({
    el: '#services',
    ItemView: App.Views.Service.Item,
    initialize: function(opt) {
      _.bindAll(this);

      // Assign function to collection events
      this.collection.bind('reset', this.addAll, this);
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('change', this.change, this);
      this.collection.bind('destroy', this.destroy, this);

      // Grep form from options
      if (opt && opt.form) {
        this.form = opt.form;
      }

      // Grep itemTagName from options
      this.itemTagName = (opt && opt.itemTagName) ? opt.itemTagName : "div";
    },
    render: function() {
      return this;
    },
    addAll: function() {
      this.$el.html('');
      this.collection.each(this.addOne);
    },
    addOne: function(item) {
      this.$el.append(new this.ItemView({model: item, form: this.form, tagName: this.itemTagName}).render().el);
    },
    change: function(item) {
      if (item.id != undefined) {
        $('#service-' + item.id).replaceWith(new this.ItemView({model: item, form: this.form, tagName: this.itemTagName}).render().el);
      } else {
        this.addAll();
      }
    },
    destroy: function() {
      // not needed at the moment
    }
  }));

})(jQuery, Dime);
