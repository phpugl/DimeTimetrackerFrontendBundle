/**
 * Dime - views/service.item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Service
  var SericeItemView = App.provide('Views.Service.Item', Backbone.View.extend({
    tagName: 'div',
    template: '#tpl-service-item',
    events: {
      'click .edit': 'edit',
      'click .delete': 'delete'
    },
    initialize: function(opt) {
      _.bindAll(this);

      // get form from options
      if (opt && opt.form) {
        this.form = opt.form;
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
      this.$el.attr('id', 'service-' + this.model.get('id'));
      return this;
    },
    edit: function() {
      // set model to form view
      this.form.model = this.model;
      // render form
      this.form.render();
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
