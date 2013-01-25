'use strict';

/**
 * Dime - core/views/filter.customer.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Customer', Backbone.View.extend({
        events: {},
        parent: undefined,
        options: {
            name: 'customer',
            ui: '#filter-customer',
            events:{
                'change #filter-customer':'filterCustomer'
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

            this.customers = App.session.get('customer-filter-collection', function () {
                return new App.Collection.Customers();
            });

            this.projects = App.session.get('project-filter-collection', function () {
                return new App.Collection.Projects();
            });
        },
        render: function(parent) {
            this.parent = parent;

            // Render a customer select list
            this.component = new App.Views.Core.Select({
                el:this.options.ui,
                collection:this.customers,
                options:{
                    blankText:'by customer'
                }
            }).render();

            return this;
        },
        remove: function() {
            if (this.customers) {
                this.customers.off();
            }
        },
        updateUI: function(filter) {
            if (filter) {
                if (filter[this.options.name]) {
                    this.component.select(filter[this.options.name]);
                    this.projects.fetch({ data: { filter: { customer: filter[this.options.name] } } });
                } else {
                    this.component.select('');
                    this.projects.fetch();
                }
            }
        },
        toggleFilter: function() {
            this.customers.fetch();
        },
        resetFilter:function (filter) {
            if (filter && filter[this.options.name]) {
                delete filter[this.options.name];
            }
        },
        filterCustomer:function (e) {
            if (e) {
                e.preventDefault();
            }

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
