'use strict';

/**
 * Dime - core/views/filter.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter', Backbone.View.extend({
        events:{
            'click #filter-button':'toggleFilter',
            'click #filter-reset':'resetFilter',
            'changeDate #filter-date':'filterDate',
            'change #filter-customer':'filterCustomer',
            'change #filter-project':'filterProject',
            'change #filter-service':'filterService',
            'keyup #filter-search':'filterSearch'
        },
        defaults: {
            name: 'filter',
            ui: {
                filter: '#filter',
                toggleButton: '#filter-button',
                resetButton: '#filter-reset',
                dates: '#filter-date',
                customers: '#filter-customer',
                projects: '#filter-project',
                services: '#filter-service',
                search: '#filter-search'
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

            if (this.defaults.ui.customers) {
                this.customers = App.session.get('customers', function () {
                    return new App.Collection.Customers();
                });
            }

            if (this.defaults.ui.projects) {
                this.projects = App.session.get('projects', function () {
                    return new App.Collection.Projects();
                });
            }

            if (this.defaults.ui.services) {
                this.services = App.session.get('services', function () {
                    return new App.Collection.Services();
                });
            }
        },
        render: function() {
            var filter = App.session.get(this.defaults.name);

            // Render a customer select list
            if (this.defaults.ui.customers) {
                this.customerFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.customers,
                    collection:this.customers,
                    defaults:{
                        blankText:'Filter by Customer'
                    }
                }).render();
            }

            // Render a project select list
            if (this.defaults.ui.projects) {
                this.projectFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.projects,
                    collection:this.projects,
                    defaults:{
                        blankText:'Filter by Project'
                    }
                }).render();
            }

            // Render a service select list
            if (this.defaults.ui.services) {
                this.serviceFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.services,
                    collection:this.services,
                    defaults:{
                        blankText:'Filter by Service'
                    }
                }).render();
            }

            return this;
        },
        toggleFilter:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {};

            filter.open = (filter.open) ? false : true;
            $(this.defaults.ui.filter).toggle(filter.open);

            App.session.set(this.defaults.name, filter);

            return this;
        },
        updateFilter: function(defaults) {
            var filter = App.session.get(this.defaults.name) || defaults;

            if (filter) {
                // Display date
                if (this.defaults.ui.dates && filter.date) {
                    var dateInput = $(this.defaults.ui.dates), dateText = $(this.defaults.ui.dates + '-text');

                    dateInput.data('date', filter.date.format(dateInput.data('date-format')));
                    dateInput.data('date-period', filter['date-period']);
                    if (dateInput.data('datepicker')) {
                        dateInput.data('datepicker').update();
                    }

                    var date = filter.date.clone(), text = '', help = '';
                    switch (filter['date-period']) {
                        case 'D':
                            text = date.format('YYYY-MM-DD');
                            break;
                        case 'W':
                            text = 'Week ' + date.format('w, YYYY');
                            break;
                        case 'M':
                            text = date.format('MMM YYYY');
                            break;
                        case 'Y':
                            text = date.format('YYYY');
                            break;
                    }

                    dateInput.attr('title', text);
                    dateText.text(text);
                }

                // Display customer
                if (this.defaults.ui.customers) {
                    if (filter.customer) {
                        this.customerFilter.select(filter.customer);
                    } else {
                        this.customerFilter.select('');
                    }
                }

                // Display projects
                if (this.defaults.ui.projects) {
                    if (filter.project) {
                        this.projectFilter.select(filter.project);
                    } else {
                        this.projectFilter.select('');
                    }
                }

                // Display services
                if (this.defaults.ui.services) {
                    if (filter.service) {
                        this.serviceFilter.select(filter.service);
                    } else {
                        this.serviceFilter.select('');
                    }
                }

                // Display search
                if (this.defaults.ui.search) {
                    var searchFilter = $(this.defaults.ui.search);
                    if (filter.search) {
                        searchFilter.val(filter.search);
                    } else {
                        searchFilter.val();
                    }
                }
            }

            if (filter && filter.open) {
                $(this.defaults.ui.filter).show();
            }

            if (this.collection) {
                this.collection.filter(filter);
                this.collection.resetPager();
                this.collection.load();
            }

        },
        resetFilter:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {};

            for (var name in filter) if (filter.hasOwnProperty(name)) {
                if (name == 'open') { continue; }
                delete filter[name];
            }

            if (this.defaults.ui.dates) {
                filter.date = moment();
                filter['date-period'] = 'D';
            }

            App.session.set(this.defaults.name, filter);

            this.updateFilter();
            this.toggleFilter();

            return this;
        },
        filterDate:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                input = $(this.defaults.ui.dates);

            filter.date = moment(input.data('date')).clone();
            filter['date-period'] = input.data('date-period');

            App.session.set(this.defaults.name, filter);
            this.updateFilter();

            return this;
        },
        filterCustomer:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                value = $(this.defaults.ui.customers).val();

            if (value && value.length > 0) {
                filter.customer = value;
            } else {
                delete filter.customer;
            }

            App.session.set(this.defaults.name, filter);
            this.updateFilter();

            return this;
        },
        filterProject:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                value = $(this.defaults.ui.projects).val();

            if (value && value.length > 0) {
                filter.project = value;
            } else {
                delete filter.project;
            }

            App.session.set(this.defaults.name, filter);
            this.updateFilter();

            return this;
        },
        filterService:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                value = $(this.defaults.ui.services).val();

            if (value && value.length > 0) {
                filter.service = value;
            } else {
                delete filter.service;
            }

            App.session.set(this.defaults.name, filter);
            this.updateFilter();

            return this;
        },
        filterSearch:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                value = $(this.defaults.ui.search).val();

            // TODO intelligent update
            if (value && value.length > 0) {
                filter.search = value;
            } else {
                delete filter.search;
            }

            App.session.set(this.defaults.name, filter);
            this.updateFilter();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
