/**
 * Dime - app/activity/edit.js
 */
(function ($, App) {

  // Dashboard view
  App.provide('Views.Activity.Edit', App.Views.Core.Content.extend({
    templateEl: '#activity-form',
    template: 'DimeTimetrackerFrontendBundle:Activities:edit',
    events: {
      'click .save': 'save',
      'click .close': 'close',
      'click .cancel': 'close'
    },
    initialize: function(model) {
      if (!model) throw "Initialize Activity.Edit with a Activity model";
      this.model = model;

      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this);
    },
    render: function() {
      this.setElement(this.templateEl);
      this.form = this.$el.form();
      this.form.clear();
      this.form.fill(this.model.toJSON());

      var customers = new App.Collection.Customers();
      var selectBox = new App.Views.Base.Select({
        el: this.form.get('customer'),
        collection: customers,
        defaults: {
          selected: this.model.get('customer')
        }
      });
      customers.fetch();

      var services  = new App.Collection.Services();
      selectBox = new App.Views.Base.Select({
        el: this.form.get('service'),
        collection: services,
        defaults: {
          selected: this.model.get('service')
        }
      });
      services.fetch();

      // Render select box for project
      var projects  = new App.Collection.Projects();
      selectBox = new App.Views.Base.Select({
        el: this.form.get('project'),
        collection: projects,
        defaults: {
          selected: this.model.get('project')
        }
      });
      projects.fetch();

      // Render timeslices
      this.activityList = new App.Views.Base.List({
        el: '#timeslices',
        collection: this.model.relation('timeslices'),
        defaults: {
          prefix: 'timeslice-',
          prependItem: true,
          itemView: App.Views.Timeslice.Item,
          itemTagName: "tr",
          itemAttributes: {
            "class": "timeslice"
          }
        }
      }).render();
      
      return this;
    },
    save: function() {
      this.model.save(this.form.data(), { success: this.close });
    },
    close: function() {
      // TODO Hardcoded is bad
      App.UI.router.navigate('', true);
    }
  }));

})(jQuery, Dime);