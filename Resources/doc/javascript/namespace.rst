Namespace
=========

::

    window.Dime = {}

The namespace "window.Dime" is the container that contain all the objects.

Add new structure to namespace
------------------------------

The namespace has the function "Dime.provide" to extend it self.

::

    Dime.provide(name, obj, force)

    Example:

    Dime.provide('session', function(param) {
        // do somthing
    });

    Call it now with:

    Dime.session(param);

You can also extend the Dime namespace with a "dot" based syntax. The Object in between will be created automatically.

::

    Dime.provide('Views.Core.Content', Backbone.View.extend({
        // add properties to extend the view
    }));

    Now you can create this view.

    var view = new Dime.Views.Core.Content();

Namespace predefined objects
----------------------------

The predefined objects are container for backbone related objects,

::

    Collection:{},   ... Contain all backbone collections
    Helper:{},       ... Contain all helper
    Model:{},        ... Contain all backbone models
    Views:{},        ... Contain all backbone views
    Router:{},       ... Contain all backbone routes
    Route:{},        ... Contain route to api
    UI:{},           ... Contain ui related objects (menu, router)


Namespace predefined functions
------------------------------

::

    initialize(item)               ... Initialization hook
    log(msg, level)                ... Basic console.log wrapper
    menu(item)                     ... Add a new menu item
    provide(name, object, force)   ... Create namespace onject
    run()                          ... Initialize the whole app
    route(name, route, callback)   ... Manage app routes
    template(name)                 ... Fetch remote templates and store them
