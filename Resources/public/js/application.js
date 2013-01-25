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

        // Return Dime object
        return {
            Collection:{},
            Helper:{},
            Model:{},
            Views:{},
            Route:{
                Activities:'api/activities',
                Customers:'api/customers',
                Parser:'api/process',
                Projects:'api/projects',
                Services:'api/services',
                Settings:'api/settings',
                Timeslices:'api/timeslices',
                Tags:'api/tags',
                Users:'api/users'
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
             * add notification to area-header
             *
             * @param message message of notification
             * @param type, if undefined will be warning style [info|success|error]
             * @param delay, default: 2000
             */
            notify:function (message, type, delay) {
                var template = this.template("#tpl-application-notification");
                if (delay === undefined) {
                    delay = 2000;
                }

                if (template) {
                    var header = $('#area-header');
                    if (header) {
                        var data = {message: message, type: ' alert-info'};
                        if (type !== undefined) {
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

                // Initialize
                var initialize = this.hook.where({scope: 'initialize'});
                if (initialize.length > 0) {
                    for (var i = 0; i < initialize.length; i++) {
                        var model = initialize[i],
                            callback = model.get('callback');

                        if (callback) {
                            this.log('Initialize ' + model.id, 'DEBUG');
                            callback();
                        }
                    }
                }

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
                            if (data.search(/<%/) !== -1) {
                                store.templates[name] = _.template(data);
                            } else {
                                store.templates[name] = data;
                            }
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

    var ApplicationRouter = Backbone.Router.extend({
        el:undefined,
        '$el':undefined,
        currentRoute:undefined,
        currentView:undefined,
        navigate:function (fragment, options) {
            this.currentRoute = fragment;
            return Backbone.Router.prototype.navigate.call(this, fragment, options);
        },
        route: function(route, name, callback) {
            Dime.log("Add route [" + route + "]");
            return Backbone.Router.prototype.route.call(this, route, name, callback);
        },
        setElement:function (el) {
            this.el = el;
            this.$el = $(this.el);
        },
        switchView:function (view) {
            if (this.currentView) {
                // Detach the old view
                this.currentView.remove();
                this.$el.addClass('loading');
            }
            // fetch template
            view.$el.html(Dime.template(view.template));
            this.$el.html(view.el);
            view.render();
            this.currentView = view;
            this.$el.removeClass('loading');
        }
    });
    Dime.provide('router', new ApplicationRouter());

    // Expose Dime to the global object
    if (!window.Dime) {
        window.Dime = Dime;
    }

    $(function () {
        Dime.run();
    });
})(jQuery, Backbone, _, moment, window);
