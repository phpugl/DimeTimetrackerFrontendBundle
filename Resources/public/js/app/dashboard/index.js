/**
 * Dime - app/dashboard/index.js
 */
(function ($, App) {

  // Define Routes
  App.route("dashboard", "", function() {
    App.UI.router.switchView(new App.Views.Dashboard());
  });

  App.route("activity:edit", "activity/edit/:id", function(id) {
    var model = new App.Model.Activity({id: id});
    model.fetch({async: false});
    App.UI.router.switchView(new App.Views.Activity.Edit(model));
  });

  // Dashboard view
  App.provide('Views.Dashboard', App.Views.Core.Content.extend({
    template: 'DimeTimetrackerFrontendBundle:Dashboard:index',
    render: function() {
      // fetch activities
      this.activities = new App.Collection.Activities();
      this.activityList = new App.Views.Base.List({
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