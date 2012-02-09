/**
 * Dime - views/service.item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Base
  App.provide('Views.Base.Item', Backbone.View.extend({
    tagName: 'div',
    prefix: '',
    events: {
      'click .edit': 'edit',
      'click .delete': 'delete'
    },
    initialize: function(opt) {
      // populate view with options
      if (opt) {
        if (opt.form) {
          this.form = opt.form;
        }
        if (opt.prefix) {
          this.prefix = opt.prefix;
        }
      }

      // bind remove function to model
      this.model.bind('destroy', this.remove, this);
    },
    render: function() {
      // grep template with jquery and generate template stub
      var temp = _.template($(this.template).html());

      // fill model date into template and push it into element html
      this.$el.html(temp(this.model.toJSON()));

      // add element id with prefix
      this.$el.attr('id', this.prefix + this.model.get('id'));
      
      return this;
    },
    edit: function() {
      // set model to form view
      this.form.model = this.model;
      // render form
      this.form.render();

      return this;
    },
    remove: function() {
      // remove element from DOM
      this.$el.remove();
    },
    'delete': function() {
      // confirm destroy action
      if (confirm("Are you sure?")) {
        this.model.destroy();
      }
    }
  }));
})(jQuery, Dime);
