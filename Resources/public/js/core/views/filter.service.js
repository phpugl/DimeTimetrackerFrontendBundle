'use strict';

/**
 * Dime - core/views/filter.service.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Service', Backbone.View.extend({
        events: {},
        parent: undefined,
        options: {
            name: 'service',
            ui: '#filter-service',
            events:{
                'change #filter-service':'filterService'
            }
        },
        initialize: function(config) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            if (config && config.options) {
                this.options = $.extend(true, {}, this.options, config.options);
            }

            if (this.options.events) {
                this.events = $.extend(true, {}, this.events, this.options.events);
            }

            this.services = App.session.get('service-filter-collection', function () {
                return new App.Collection.Services();
            });
        },
        render: function(parent) {
            this.parent = parent;

            // Render a service select list
            this.component = new App.Views.Core.Select({
                el:this.options.ui,
                collection:this.services,
                options:{
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
                if (filter[this.options.name]) {
                    this.component.select(filter[this.options.name]);
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
            if (filter && filter[this.options.name]) {
                  delete filter[this.options.name];
            }
        },
        filterService:function (e) {
            if (e) {
                e.preventDefault();
            }

            if (this.update) return this;

            var filter = App.session.get(this.parent.options.name) || {},
                value = this.component.value();

            if (value && value.length > 0) {
                filter[this.options.name] = value;
            } else {
                delete filter[this.options.name];
            }

            App.session.set(this.parent.options.name, filter);
            this.parent.updateFilter();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
