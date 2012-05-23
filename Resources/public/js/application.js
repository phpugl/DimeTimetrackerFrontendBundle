/**
 * Dime - application.js
 *
 * Initialize the javascript application
 */
(function ($, window) {

  // Initialize namespace Dime with collection, model and views object
  var Dime = window.Dime || function() {
    var store = {
      routes: {},
      templates: {}
    };

    return {
      Collection: {},
      Model: {},
      Views: {},
      Router: {},
      Route: {
        Activities: 'api/activities',
        Customers:  'api/customers',
        Parser:     'api/process',
        Projects:   'api/projects',
        Services:   'api/services',
        Timeslices: 'api/timeslices'
      },
      UI: {},
      /**
       * App initialize function
       *
       * @return Dime
       */
      initialize: function() {
        this.log('Starting application', 'INFO');

        this.UI.main = new this.Views.Main();
        this.UI.main.render();
        this.UI.router = new this.Router.Main({routes: store.routes});
        Backbone.history.start();
              
        return this;
      },
      /**
       * Log a message if a logger exists
       *
       * @param msg, message to log
       * @param level, optional, [INFO|WARN|ERROR]
       * @return Dime
       */
      log: function(msg, level) {
        if (!msg) throw "Provide a message for Dime.log(msg)";

        var text = moment().format('HH:mm:ss ');
        if (level) {
          text = ["[",level,"] ", text].join('');
        }

        if (console && console.log) {
          if (typeof(msg) == 'string') {
            console.log(text + msg);
          } else {
            console.log(text);
            console.log(msg);
          }
                    
        }

        return this;
      },
      /**
       * Create namespace object if needed in Dime splitted by dot (.).
       * Example:
       *   Dime.provide('Views.Service') -> create Service in Views
       *
       * @param name Namspace items splitted by dot (.)
       * @param obj optional, set to the last item in path
       * @return parent object
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
      },
      /**
       * 
       */
      route: function(name, route, callback) {
        if (name === undefined) {
          return store.routes;
        }
        if (route === undefined && callback == undefined) {
          return store.routes[name];
        }

        store.routes[name] = {
          route: route,
          callback: callback
        }

        return this;
      },
      /**
       * Fetch remote template and save it for later use
       *
       * @param name Name of Symfony2 template (e.g. DimeTimetrackerFrontedBundle:Activity:activityForm)
       * @return HTML template
       */
      template: function(name) {
        if (!name) throw "Give a name for Dime.template(name)";

        if (!store.templates[name]) {
          $.ajax({
            async: false,
            url: 'template/' + name,
            dataType: 'html',
            success: function(data) {
              store.templates[name] = data;
            }
          });
        }

        return store.templates[name];
      }
    };
  }();

  // Expose Dime to the global object
  if (!window.Dime) {
    window.Dime = Dime;
  }

  $(function() {
    Dime.initialize();
  });
})(jQuery, window);
