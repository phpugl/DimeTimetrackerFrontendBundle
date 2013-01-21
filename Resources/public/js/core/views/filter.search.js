'use strict';

/**
 * Dime - core/views/filter.search.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Search', Backbone.View.extend({
        events: {},
        parent: undefined,
        update: false,
        defaults: {
            name: 'search',
            ui: '#filter-search',
            events:{
                'input #filter-search': 'filterSearch'
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

            this.component = $(this.defaults.ui);
        },
        render: function(parent) {
            this.parent = parent;
            return this;
        },
        remove: function() {},
        updateUI: function(filter) {
            if (filter) {
                this.update = true;
                if (filter[this.defaults.name]) {
                    this.component.val(filter[this.defaults.name]);
                } else {
                    this.component.val();
                }
                this.update = false;
            }
        },
        toggleFilter: function() {},
        resetFilter:function (filter) {
            if (filter && filter[this.defaults.name]) {
                delete filter[this.defaults.name];
            }
        },
        filterSearch:function (e) {
            if (e) {
                e.preventDefault();
            }

            if (this.update) return this;

            var filter = App.session.get(this.parent.defaults.name) || {},
                value = this.component.val();

            // TODO intelligent update
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
