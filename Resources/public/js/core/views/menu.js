/**
 * Dime - core/views/menu.js
 */
(function ($, App) {

  App.provide('Views.Core.MenuItem', Backbone.View.extend({
    tagName: "li",
    template: '<a href="#<%- uri %>" title="<%- title %>"><%- title %></a>',
    item: undefined,
    initialize: function() {
      _.bindAll(this, 'render');
    },
    render: function() {
      var temp = _.template(this.template);
      
      this.$el.html(temp({
        uri: this.model.get('route'),
        title: this.model.get('title')
      }));
      return this;
    }
  }));

  App.provide('Views.Core.Menu', Backbone.View.extend({
    tagName: "ul",
    currentActive: undefined,
    defaults: {
      itemView: App.Views.Core.MenuItem
    },
    initialize: function(opt) {
      App.log('Initialize main menu', 'INFO');
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this, 'render', 'addOne', 'activateItem');

      // Assign function to collection events
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
      this.collection.on('change', this.render, this);

      // Grep default values from option
      if (opt && opt.defaults) {
        this.defaults = _.extend({}, this.defaults, opt.defaults);
      }
    },
    render: function() {
      // remove all content
      this.$el.html('');

      if (this.collection.length > 0) {
        this.collection.each(this.addOne);
      }

      return this;
    },
    addOne: function(model){
      var view = new this.defaults.itemView({
        model: model,
        attributes: (model.get('active')) ? {'class': 'active'} : {}
      });
      
      if (model.get('active')) {
        this.currentActive = model;
      }
      
      this.$el.append(view.render().el);
    },
    activateItem: function(name) {
      var model = this.collection.where({name: name});

      if (model.length > 0) {
        this.currentActive.set('active', false);
        for (var i=0; i<model.length; i++) {
          model[i].set('active', true);
          this.currentActive = model[i];
        }
      }
    }
  }));

})(jQuery, Dime);
