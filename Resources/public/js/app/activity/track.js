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

      this.activities = App.session('activities');
      if (!this.activities) {
        this.activities = App.session('activities', new App.Collection.Activities());
      }
    },
    save: function(e) {
      e.preventDefault();
      var icon = $('i', '#activity-track').addClass('loading-14-white'),
          input = $('#activity-track-input');

      var data = $('#activity-track-input').val();
      if (data && data !== "") {
        this.activities.create({parse: data}, {
          wait: true,
          success: function() {
            input.val('');
            icon.removeClass('loading-14-white');
          }
        });
      }
    }
  }));

})(jQuery, Dime);