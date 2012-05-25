/**
 * Dime - app/dashboard/index.js
 */
(function ($, App) {

  App.menu({
    name: "activity",
    title: "Activity",
    route: "",
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
      title: 'Add Activity',
      templateEl: '#activity-form',
      template: 'DimeTimetrackerFrontendBundle:Activities:form',
      backNavigation: 'activity',
      model: model
    }));
  });

  App.route("activity:edit", "activity/:id/edit", function(id) {
    var model = new App.Model.Activity({id: id});
    model.fetch({async: false});

    App.UI.menu.activateItem('activity');
    App.UI.router.switchView(new App.Views.Activity.Form({
      title: 'Edit Activity',
      templateEl: '#activity-form',
      template: 'DimeTimetrackerFrontendBundle:Activities:form',
      backNavigation: 'activity',
      model: model
    }));
  });

  // Activity index view
  App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
    template: 'DimeTimetrackerFrontendBundle:Activities:index',
    initialize: function() {
      this.activities = App.provide('UI.activities', new App.Collection.Activities());
    },
    render: function() {
      this.list = new App.Views.Base.List({
        el: '#activities',
        collection: this.activities,
        defaults: {
          prefix: 'activity-',
          prependItem: true,
          itemView: App.Views.Activity.Item,
          itemTagName: "section",
          itemAttributes: {
            "class": "activity"
          }
        }
      }).render();
      this.activities.fetch();
    }
  }));

})(jQuery, Dime);