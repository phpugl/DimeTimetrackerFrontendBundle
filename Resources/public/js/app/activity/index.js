/**
 * Dime - app/dashboard/index.js
 */
(function ($, App) {

  App.menu({
    name: "activity",
    title: "Activity",
    route: "activity",
    weight: -20,
    active: true,
    callback: function() {
      App.UI.menu.activateItem('activity');
      App.UI.router.switchView(new App.Views.Activity.Index());
    }
  });

  // Define Routes  
  App.route("activity:add", "activity/add", function() {
    var model = new App.Model.Activity();

    App.UI.menu.activateItem('activity');
    App.UI.router.switchView(new App.Views.Activity.Form({
      defaults: {
        title: 'Add Activity',
        template: 'DimeTimetrackerFrontendBundle:Activities:form',
        templateEl: '#activity-form',
        backNavigation: 'activity'
      },
      model: model
    }));
  });

  App.route("activity:edit", "activity/:id/edit", function(id) {
    var model = new App.Model.Activity({id: id});
    model.fetch({async: false});

    App.UI.menu.activateItem('activity');
    App.UI.router.switchView(new App.Views.Activity.Form({
      defaults: {
        title: 'Edit Activity',
        template: 'DimeTimetrackerFrontendBundle:Activities:form',
        templateEl: '#activity-form',
        backNavigation: 'activity'
      },
      model: model
    }));
  });

  App.route("activity:add-timeslice", "activity/:id/timeslice/add", function(id) {
    var activity = new App.Model.Activity({id: id});
    activity.fetch({async: false});

    var model = new App.Model.Timeslice({ activity: activity.get('id') });
    
    App.UI.menu.activateItem('activity');
    App.UI.router.switchView(new App.Views.Timeslice.Form({
      defaults: {
        title: 'Edit Timeslice',
        template: 'DimeTimetrackerFrontendBundle:Timeslices:form',
        templateEl: '#timeslice-form',
        backNavigation: 'activity/' + activity.get('id') + '/edit'
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
 
  // Activity index view
  App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
    template: 'DimeTimetrackerFrontendBundle:Activities:index',
    events: {
      'click #filter-button': 'toggleFilter'
    },
    initialize: function() {
      this.activities = App.session('activities');
      if (!this.activities) {
        this.activities = App.session('activities', new App.Collection.Activities());
      }
    },
    render: function() {
      this.list = new App.Views.Core.List({
        el: '#activities',
        collection: this.activities,
        defaults: {
          prefix: 'activity-',
          item: {
            attributes: { "class": "activity" },
            prepend: true,
            tagName: "section",
            View: App.Views.Activity.Item
          }
          
        }
      }).render();
      this.activities.fetch();

      var customers = App.session('customers');
      if (!customers) {
        customers = App.session('customers', new App.Collection.Customers());
      }
      var selectBox = new App.Views.Core.Select({
        el: '.filter-customer',
        collection: customers,
        defaults: {
          blankText: 'Filter by Customer'
        }
      });
      selectBox.refetch();

    },
    toggleFilter: function(e) {
        e.preventDefault();
      $('#filter').toggle();
    }
  }));

})(jQuery, Dime);