/*
 * Dime - app/main.js
 */
(function ($, App) {

  // Initialize main view - bind on <body>
  App.initialize({
    name: 'activity:tracker',
    callback: function() {
      var tracker = new App.Views.Activity.Track();
      tracker.render();
    }
  });

  // Activity track input view
  App.provide('Views.Activity.Track', Backbone.View.extend({
    el: '#activity-track',
    events: {
      'submit': 'save'
    },
    initialize: function() {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this, 'save');

      this.activities = App.provide('UI.activities', new App.Collection.Activities());
    },
    save: function(e) {
      e.preventDefault();

      var data = $('#activity-track-input').val();
      if (data && data !== "") {
        this.activities.create({parse: data}, {
          wait: true,
          success: function() {
            $('#activity-track-input').val('');
          }
        });
      }
    }
  }));

})(jQuery, Dime);