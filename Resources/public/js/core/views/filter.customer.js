'use strict';

/**
 * Dime - core/views/filter.customer.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Customer', Backbone.View.extend({
        events: {},
        parent: undefined,
        defaults: {
            name: 'customer',
            ui: '#filter-customer',
            events:{
                'change #filter-customer':'filterCustomer'
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
                el:this.defaults.ui,
                collection:this.customers,
                defaults:{
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
                if (filter[this.defaults.name]) {
                    this.component.select(filter[this.defaults.name]);
                    App.log(filter[this.defaults.name]);
                    this.projects.fetch({ data: { filter: { customer: filter[this.defaults.name] } } });
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
            if (filter && filter[this.defaults.name]) {
                delete filter[this.defaults.name];
            }
        },
        filterCustomer:function (e) {
            if (e) {
                e.preventDefault();
            }

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
