/*
 * Dime - service list view
 */

(function ($, App) {

  // provide Base namespace in App.Views
  var BaseView = App.provide('Views.Base');
  
  BaseView.Option = Backbone.View.extend({
    tagName: "option",
    defaults: {
      name: 'name',
      value: 'id',
      blank: ''
    },
    initialize: function(opt) {
      _.bindAll(this, 'render');

      if (opt && opt.defaults) {
        this.defaults = _.extend({}, this.defaults, opt.defaults);
      }
    },
    render: function() {
      if (this.model) {
        this.$el
          .attr('value', this.model.get(this.defaults.value))
          .text(this.model.get(this.defaults.name));
      } else {
        this.$el
          .attr('value', '')
          .text(this.defaults.blank);
      }
      return this;
    }
  });

  BaseView.Select = Backbone.View.extend({
    tagName: "select",
    defaults: {
      withBlank: true,
      selected: undefined,
      view: BaseView.Option
    },
    initialize: function(opt){
      _.bindAll(this, 'addBlank', 'addOne', 'addAll');
      this.collection.bind('reset', this.addAll, this);

      if (opt && opt.defaults) {
        // grep selected option can be service object or just the id
        if (opt.defaults.selected) {
          opt.defaults.selected = (opt.defaults.selected.id) ? opt.defaults.selected.id : opt.defaults.selected;
        }

        this.defaults = _.extend({}, this.defaults, opt.defaults);
      }
    },
    addBlank: function() {
      var view = new this.defaults.view();
      this.selectViews.push(view);
      this.$el.append(view.render().el);
    },
    addOne: function(obj){
      var view = new this.defaults.view({
        model: obj
      });
      this.selectViews.push(view);
      this.$el.append(view.render().el);
    },
    addAll: function() {
      // clear select
      this.$el.html('');

      _.each(this.selectViews, function(optionView) {
        optionView.remove();
      });
      this.selectViews = [];
      if (this.defaults.withBlank) {
        this.addBlank();
      }
      this.collection.each(this.addOne);

      // select option if selectedId exists
      if (this.defaults.selected) {
        this.$el.val(this.defaults.selected);
      }
    }
  });

})(jQuery, Dime);
