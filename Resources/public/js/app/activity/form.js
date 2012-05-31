/**
 * Dime - app/activity/form.js
 */
(function ($, App) {

  App.route("timeslice:add", "timeslice/add", function() {
    var model = new App.Model.Timeslice();

    App.UI.menu.activateItem('activity');
    App.UI.router.switchView(new App.Views.Core.Form({
      defaults: {
        title: 'Edit Timeslice',
        template: 'DimeTimetrackerFrontendBundle:Timeslices:form',
        templateEl: '#timeslice-form',
        backNavigation: 'activity/' + model.relation('activity').get('id') + '/edit'
      },
      model: model
    }));
  });

  App.route("timeslice:edit", "timeslice/:id/edit", function(id) {
    var model = new App.Model.Timeslice({id: id});
    model.fetch({async: false});

    App.UI.menu.activateItem('activity');
    App.UI.router.switchView(new App.Views.Core.Form({
      defaults: {
        title: 'Edit Timeslice',
        template: 'DimeTimetrackerFrontendBundle:Timeslices:form',
        templateEl: '#timeslice-form',
        backNavigation: 'activity/' + model.relation('activity').get('id') + '/edit'
      },
      model: model
    }));
  });

  // Activity form view
  App.provide('Views.Activity.Form', App.Views.Core.Form.extend({
    render: function() {
      this.setElement(this.defaults.templateEl);
      
      // Set title
      if (this.defaults.title) {
        $('h1.title', this.$el).text(this.defaults.title);
      }

      // Fill form
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
      this.activityList = new App.Views.Core.List({
        el: '#timeslices',
        collection: this.model.relation('timeslices'),
        defaults: {
          prefix: 'timeslice-',
          item: {
            attributes: { "class": "timeslice" },
            prepend: true,
            tagName: "tr",
            View: App.Views.Timeslice.Item
          }
        }
      }).render();
      
      return this;
    }
  }));

})(jQuery, Dime);