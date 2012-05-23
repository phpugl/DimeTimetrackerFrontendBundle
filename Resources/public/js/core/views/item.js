/**
 * Dime - core/views/item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Base
  App.provide('Views.Base.Item', Backbone.View.extend({
    tagName: 'div',
    defaults: {
      prefix: ''
    },
    events: {
      'click .delete': 'delete'
    },
    initialize: function(opt) {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this);
      
      // Grep default values from option
      if (opt && opt.defaults) {
        $.extend(true, this.defaults, opt.defaults);
      }

      // bind remove function to model
      this.model.bind('destroy', this.remove, this);
    },
    elId: function() {
      var id = this.$el.attr('id');
      return (id) ? id : this.defaults.prefix + this.model.get('id');
    },
    render: function() {
      // grep template with jquery and generate template stub
      var temp = _.template($(this.template).html());

      // fill model date into template and push it into element html
      this.$el.html(temp({model: this.model, data: this.model.toJSON()}));

      // add element id with prefix
      this.$el.attr('id', this.elId);
      
      return this;
    },
    remove: function() {
      // remove element from DOM
      this.$el.empty().detach();
    },
    'delete': function(e) {
      e.preventDefault();
      e.stopPropagation();

      // confirm destroy action
      if (confirm("Are you sure?")) {
        this.model.destroy({wait: true});
      }
    }
  }));
})(jQuery, Dime);
