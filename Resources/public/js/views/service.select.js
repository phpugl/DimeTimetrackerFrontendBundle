/*
 * Dime - service list view
 */

(function ($, App) {

  // provide Service namespace in App.Views
  var SericeView = App.provide('Views.Service');
  
  SericeView.Option = Backbone.View.extend({
    tagName: "option",
    initialize: function() {
        _.bindAll(this, 'render');
    },
    render: function() {
        this.$el.attr('value', this.model.get('id')).html(this.model.get('name'));
        return this;
    }
  });

  SericeView.Select = Backbone.View.extend({
    initialize: function(opt){
        _.bindAll(this, 'addOne', 'addAll');
        this.collection.bind('reset', this.addAll);

        // grep selected option can be service object or just the id
        if (opt && opt.selected) {
          this.selectedId = (opt.selected.id) ? opt.selected.id : opt.selected;
        }
    },
    addOne: function(obj){
        var optionView = new SericeView.Option({ model: obj });
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
