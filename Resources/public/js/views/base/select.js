/*
 * Dime - service list view
 */

(function ($, App) {

  // provide Base namespace in App.Views
  var BaseView = App.provide('Views.Base');
  
  BaseView.Option = Backbone.View.extend({
    tagName: "option",
    optionName: 'name',
    optionValue: 'id',
    initialize: function(opt) {
        _.bindAll(this, 'render');

        if (opt) {
          if (opt.optionName) {
            this.optionName = opt.optionName;
          }
          if (opt.optionValue) {
            this.optionValue = opt.optionValue;
          }
        }
    },
    render: function() {
        this.$el.attr('value', this.model.get(this.optionValue)).html(this.model.get(this.optionName));
        return this;
    }
  });

  BaseView.Select = Backbone.View.extend({
    optionView: BaseView.Option,
    initialize: function(opt){
        _.bindAll(this, 'addOne', 'addAll');
        this.collection.bind('reset', this.addAll);

        // grep selected option can be service object or just the id
        if (opt && opt.selected) {
          this.selectedId = (opt.selected.id) ? opt.selected.id : opt.selected;
        }

        if (opt && opt.optionView) {
          this.optionView = opt.optionView;
        }
    },
    addOne: function(obj){
        var optionView = new this.optionView({ model: obj });
        this.selectViews.push(optionView);
        this.$el.append(optionView.render().el);
    },
    addAll: function() {
        // clear select
        this.$el.html('');

        _.each(this.selectViews, function(optionView) { optionView.remove(); });
        this.selectViews = [];
        this.collection.each(this.addOne);

        // select option if selectedId exists
        if (this.selectedId) {
            this.$el.val(this.selectedId);
        }
    }
  });

})(jQuery, Dime);
