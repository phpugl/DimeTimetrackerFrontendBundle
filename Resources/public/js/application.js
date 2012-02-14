/**
 * Dime - application.js
 *
 * Initialize the javascript application
 */
(function ($, window) {

  // Initialize namespace Dime with collection, model and views object
  var Dime = window.Dime || function() {
    return {
      Collection: {},
      Model: {},
      Views: {},
      Route: {
        Activities: 'api/activities',
        Customers:  'api/customers',
        Projects:   'api/projects',
        Services:   'api/services',
        Timeslices: 'api/timeslices'
      },
      /**
       * Create namespace object if needed in Dime splitted by dot (.).
       * Example:
       *   Dime.provide('Views.Service') -> create Service in Views
       *
       * @param name Namspace items splitted by dot (.)
       * @param obj optional, set to the last item in path
       */
      provide: function(name, obj) {
        if (!name) throw "Give a name for Dime.provide(name)";     
        var parent = this;

        var parts = name.split('.');
        if (parts) {
          for (var i=0; i<parts.length; i++) {
            if (!parent[parts[i]]) {
              if (i >= parts.length - 1 && obj) {
                parent[parts[i]] = obj
              } else {
                parent[parts[i]] = {};
              }
            }
            parent = parent[parts[i]];
          }
        }

        return parent;
      }
    };
  }();

  // Expose Dime to the global object
  if (!window.Dime) {
    window.Dime = Dime;
  }

  // Run after some plugins after DOM is ready
  $(function() {
    //$('.tabs').tab('show');

    //$('nav').dropdown();

    //$('.loading').css({height: '50px', width: '100%'}).spin('large', 'black');
  });
})(jQuery, window);
