'use strict';
/**
 * Dime - application.js
 *
 * Initialize the javascript application
 */
(function ($, Backbone, _, moment, window) {

    // Initialize namespace Dime with collection, model and views object
    var Dime = window.Dime || function () {
        var store = {
            routes:{},
            templates:{}
        };

        // Main menu collection
        var init = new Backbone.Collection();
        init.comparator = function (model) {
            return model.get('weight');
        };

        // Main menu collection
        var menu = new Backbone.Collection();
        // Comparator for menu sorting
        menu.comparator = function (first, second) {
            var fW = first.get('weight'), sW = second.get('weight');
            if (fW > sW) {
                return 1;
            } else if (fW < sW) {
                return -1;
            } else {
                var fN = first.get('name'), sN = second.get('name');
                if (fN > sN) {
                    return 1;
                } else if (fN < sN) {
                    return -1;
                }
                return 0;
            }
        };

        // Return Dime object
        return {
            Collection:{},
            Helper:{},
            Model:{},
            Views:{},
            Router:{},
            Route:{
                Activities:'api/activities',
                Customers:'api/customers',
                Parser:'api/process',
                Projects:'api/projects',
                Services:'api/services',
                Timeslices:'api/timeslices',
                Tags:'api/tags',
                Users:'api/users'
            },
            UI:{},
            /**
             * Initialization hook
             *
             * @param item Object {name: 'Unique name', weight: 0, callback: func}
             * @return Dime
             */
            initialize:function (item) {
                if (item) {
                    item = _.extend({ weight:0 }, item);
                    init.add(item);
                    return this;
                } else {
                    return init;
                }
            },
            /**
             * Log a message if a logger exists
             *
             * @param msg message to log
             * @param level optional, [INFO|WARN|ERROR]
             * @return Dime
             */
            log:function (msg, level) {
                if (console && console.log) {
                    var content = [];
                    if (level) {
                        content.push(level);
                    }
                    content.push(moment().format('HH:mm:ss'));
                    content.push(msg);
                    console.log(content);
                }
                return this;
            },
            /**
             * add a menu item to main menu
             *
             * @param item object { name: 'identifier', title: 'Title', weight: 0, route: 'route/to/:id', callback: func}
             * @return Dime or menu collection
             */
            menu:function (item) {
                if (item) {
                    item = _.extend({ weight:0 }, item);
                    menu.add(item);
                    this.route(item.name, item.route, item.callback);
                    return this;
                } else {
                    return menu;
                }
            },
            /**
             * add notification to area-header
             *
             * @param message message of notification
             * @param type, if undefined will be warning style [info|success|error]
             * @param delay, default: 2000
             */
            notify:function (message, type, delay) {
                var template = this.template("#tpl-application-notification");
                if (delay == undefined) {
                    delay = 2000;
                }

                if (template) {
                    var header = $('#area-header');
                    if (header) {
                        var data = {message: message};
                        if (type) {
                            data.type = ' alert-' + type;
                        }
                        var $el = $(template(data));
                        if (delay) {
                            $el.delay(2000).promise().done(function () {
                                $el.fadeOut('slow', function() {
                                    $el.detach().remove();
                                });
                            });
                        }
                        header.append($el);
                    }
                }
            },
            /**
             * Create namespace object if needed in Dime splitted by dot (.).
             * Example:
             *   Dime.provide('Views.Service') -> create Service in Views
             *
             * @param name Namspace items splitted by dot (.)
             * @param obj optional, set to the last item in path
             * @param force optinal, force set of object
             * @return parent object
             */
            provide:function (name, obj, force) {
                if (!name) {
                    throw "Give a name for Dime.provide(name)";
                }
                var parent = this;

                var parts = name.split('.');
                if (parts) {
                    for (var i = 0; i < parts.length; i++) {
                        if (!parent[parts[i]]) {
                            if (i >= parts.length - 1 && obj) {
                                parent[parts[i]] = obj;
                            } else {
                                parent[parts[i]] = {};
                            }
                        }
                        parent = parent[parts[i]];
                    }

                    if (force) {
                        parent = obj;
                    }
                }

                return parent;
            },
            /**
             * Initialize the whole app
             *
             * @return Dime
             */
            run:function () {
                this.log('Starting application', 'INFO');

                // Initialize router
                this.UI.router = new this.Router.Main({ routes:store.routes });

                // Initialize
                if (init.length > 0) {
                    for (var i = 0; i < init.length; i++) {
                        var model = init.at(i);
                        this.log('Init ' + model.get('name'), 'DEBUG');
                        model.get('callback')();
                    }
                }

                // last action - start history without pushState
                Backbone.history.start();

                return this;
            },
            /**
             * Manage app routes
             *
             * @param name string route name, unique
             * @param route string route it self
             * @param callback function
             * @return {*}
             */
            route:function (name, route, callback) {
                if (name === undefined) {
                    return store.routes;
                }
                if (route === undefined && callback === undefined) {
                    return store.routes[name];
                }

                store.routes[name] = {
                    route:route,
                    callback:callback
                };

                return this;
            },
            /**
             * Fetch remote template and save it for later use
             *
             * @param name Name of Symfony2 template (e.g. DimeTimetrackerFrontedBundle:Activity:form)
             * @param cache, store template in cache, default: true
             * @return HTML template
             */
            template:function (name, cache) {
                if (!name) {
                    throw "Give a name for Dime.template(name)";
                }
                if (cache === undefined) {
                    cache = true;
                }

                if (cache && store.templates[name]) {
                    return store.templates[name];
                }

                if (name.search(/:/) !== -1) {
                    $.ajax({
                        async:false,
                        url:'template/' + name,
                        dataType:'html',
                        success:function (data) {
                            store.templates[name] = data;
                        }
                    });

                } else {
                    var template = $(name);
                    if (template && template[0]) {
                        template = _.template(template.html())
                    }
                    if (cache) {
                        store.templates[name] = template;
                    }
                    return template;
                }

                return store.templates[name];
            }
        };
    }();

    // Expose Dime to the global object
    if (!window.Dime) {
        window.Dime = Dime;
    }

    $(function () {
        Dime.run();
    });
})(jQuery, Backbone, _, moment, window);
