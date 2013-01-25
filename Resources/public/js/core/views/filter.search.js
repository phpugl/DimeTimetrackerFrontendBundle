'use strict';

/**
 * Dime - core/views/filter.search.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Search', Backbone.View.extend({
        events: {},
        parent: undefined,
        options: {
            name: 'search',
            ui: '#filter-search',
            events:{
                'input #filter-search': 'filterSearch'
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

            this.component = $(this.options.ui);
        },
        render: function(parent) {
            this.parent = parent;
            return this;
        },
        remove: function() {},
        updateUI: function(filter) {
            if (filter) {
                if (filter[this.options.name]) {
                    this.component.val(filter[this.options.name]);
                } else {
                    this.component.val();
                }
            }
        },
        toggleFilter: function() {},
        resetFilter:function (filter) {
            if (filter && filter[this.options.name]) {
                delete filter[this.options.name];
            }
        },
        filterSearch:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.parent.options.name) || {},
                value = this.component.val();

            // TODO intelligent update
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
