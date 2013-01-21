'use strict';

/**
 * Dime - core/views/filter.service.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Service', Backbone.View.extend({
        events: {},
        parent: undefined,
        update: false,
        defaults: {
            name: 'service',
            ui: '#filter-service',
            events:{
                'change #filter-service':'filterService'
            }
        },
        initialize: function(opt) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            if (opt && opt.defaults) {
                this.defaults = $.extend(true, {}, this.defaults, opt.defaults);
            }

            if (this.defaults.events) {
                this.events = $.extend(true, {}, this.events, this.defaults.events);
            }

            this.services = App.session.get('service-filter-collection', function () {
                return new App.Collection.Services();
            });
        },
        render: function(parent) {
            this.parent = parent;

            // Render a service select list
            this.component = new App.Views.Core.Select({
                el:this.defaults.ui,
                collection:this.services,
                defaults:{
                    blankText:'by service'
                }
            }).render();

            return this;
        },
        remove: function() {
            if (this.services) {
                this.services.off();
            }
        },
        updateUI: function(filter) {
            if (filter) {
                this.update = true;
                if (filter[this.defaults.name]) {
                    this.component.select(filter[this.defaults.name]);
                } else {
                    this.component.select('');
                }
                this.update = false;
            }
        },
        toggleFilter: function() {
            this.services.fetch();
        },
        resetFilter:function (filter) {
            if (filter && filter[this.defaults.name]) {
                  delete filter[this.defaults.name];
            }
        },
        filterService:function (e) {
            if (e) {
                e.preventDefault();
            }

            if (this.update) return this;

            var filter = App.session.get(this.parent.defaults.name) || {},
                value = this.component.value();

            if (value && value.length > 0) {
                filter[this.defaults.name] = value;
            } else {
                delete filter[this.defaults.name];
            }

            App.session.set(this.parent.defaults.name, filter);
            this.parent.updateFilter();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
