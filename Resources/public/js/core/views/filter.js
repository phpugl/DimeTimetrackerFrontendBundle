'use strict';

/**
 * Dime - core/views/filter.js
 */
(function ($, Backbone, _, moment, App) {

    App.provide('Views.Core.Filter.Form', Backbone.View.extend({
        events:{},
        defaults: {
            ui: '#filter',
            name: 'filter',
            rendered: false,
            preservedOnReset: {},
            events:{
                'click #filter-button':'toggleFilter',
                'click #filter-reset':'resetFilter'
            },
            items: {}
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
        },
        render: function() {
            // render ui items
            if (this.defaults.ui) {
                for(var name in this.defaults.items) {
                    if (this.defaults.items.hasOwnProperty(name)) {
                        var item = this.defaults.items[name].render(this);
                        item.setElement(this.el);
                    }
                }

                // Load settings to session
                var settings = {};
                if (App.session.has('settings')) {
                    settings = App.session.get('settings').values(this.defaults.name);
                }
                App.session.set('activity-filter', settings);
            }
            return this;
        },
        updateFilter: function(defaults) {
            var filter = App.session.get(this.defaults.name) || defaults;

            if (filter) {
                for(var name in this.defaults.items) {
                    if (this.defaults.items.hasOwnProperty(name)) {
                        this.defaults.items[name].updateUI(filter);
                    }
                }

                // Open filter
                if (filter.open) {
                    $(this.defaults.ui).show();
                }
            }

            if (this.collection) {
                this.collection.setFetchData('filter', filter);
                this.collection.load();
            }
        },
        toggleFilter: function(e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {};

            filter.open = (filter.open) ? false : true;
            $(this.defaults.ui).toggle(filter.open);

            if (filter.open && !this.defaults.rendered) {
                for(var name in this.defaults.items) {
                    if (this.defaults.items.hasOwnProperty(name)) {
                        this.defaults.items[name].toggleFilter();
                    }
                }
                this.defaults.rendered = true;
            }
            App.session.set(this.defaults.name, filter);

            return this;
        },
        resetFilter: function(e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {};

            for(var name in this.defaults.items) {
                if (this.defaults.items.hasOwnProperty(name)
                    && !this.defaults.preservedOnReset[name]) {
                    this.defaults.items[name].resetFilter(filter);
                }
            }

            App.session.set(this.defaults.name, filter);

            this.updateFilter();
            this.toggleFilter();

            return this;
        }

    }));
})(jQuery, Backbone, _, moment, Dime);
