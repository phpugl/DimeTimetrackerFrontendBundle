/**
 * Dime - views/dashboard.js
 */
(function ($, App) {

  // Dashboard view
  App.provide('Views.Dashboard', Backbone.View.extend({
    el: $('body'),
    ui: {},
    events: {
      'submit #activity-track': 'trackActivity'
    },
    initialize: function() {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this);

      // fetch activities
      this.activities = new App.Collection.Activities();
      this.activityForm = new App.Views.Activity.Form({
        el: '#activity-form',
        collection: this.activities
      });
      this.activityList = new App.Views.Activity.List({
        collection: this.activities,
        itemTagName: "section",
        itemAttributes: {
          "class": "activity"
        },
        form: this.activityForm
      }).render();
      this.activities.fetch();

      // find ui elements
      this.ui.activityInput = $('#activity-track-input');
    },
    trackActivity: function(e) {
      e.preventDefault();

      var data = this.ui.activityInput.val(),
          _this = this;
      if (data && data !== "") {
        this.activities.create({ parse: data }, {
          wait: true,
          success: function() {
            _this.ui.activityInput.val('');
          }
        });
      }
    }
  }));

})(jQuery, Dime);

