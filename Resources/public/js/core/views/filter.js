'use strict';

/**
 * Dime - core/views/filter.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter', Backbone.View.extend({
        events:{},
        defaults: {
            rendered: false,
            name: 'filter',
            preservedOnReset: {},
            ui: {
                filter: '#filter',
                toggleButton: '#filter-button',
                resetButton: '#filter-reset',
                dates: '#filter-date',
                customers: '#filter-customer',
                projects: '#filter-project',
                services: '#filter-service',
                withTags: '#filter-with-tags',
                withoutTags: '#filter-without-tags',
                search: '#filter-search'
            },
            events:{
                'click #filter-button':'toggleFilter',
                'click #filter-reset':'resetFilter',
                'changeDate #filter-date':'filterDate',
                'change #filter-customer':'filterCustomer',
                'change #filter-project':'filterProject',
                'change #filter-service':'filterService',
                'change #filter-with-tags':'filterWithTags',
                'change #filter-without-tags':'filterWithoutTags',
                'keyup #filter-search':'filterSearch'
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
                this.customers = App.session.get('customer-filter-collection', function () {
                    return new App.Collection.Customers();
                });
            }

            if (this.defaults.ui.projects) {
                this.projects = App.session.get('project-filter-collection', function () {
                    return new App.Collection.Projects();
                });
            }

            if (this.defaults.ui.services) {
                this.services = App.session.get('service-filter-collection', function () {
                    return new App.Collection.Services();
                });
            }

            if (this.defaults.ui.withTags || this.defaults.ui.withoutTags) {
                this.tags = App.session.get('tags-filter-collection', function () {
                    return new App.Collection.Tags();
                });
            }
        },
        render: function() {
            // Render a customer select list
            if (this.defaults.ui.customers) {
                this.customerFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.customers,
                    collection:this.customers,
                    defaults:{
                        blankText:'by customer'
                    }
                }).render();
            }

            // Render a project select list
            if (this.defaults.ui.projects) {
                this.projectFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.projects,
                    collection:this.projects,
                    defaults:{
                        blankText:'by project'
                    }
                }).render();
            }

            // Render a service select list
            if (this.defaults.ui.services) {
                this.serviceFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.services,
                    collection:this.services,
                    defaults:{
                        blankText:'by service'
                    }
                }).render();
            }

            // Render a tag select list
            if (this.defaults.ui.withTags) {
                this.withTagsFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.withTags,
                    collection:this.tags,
                    defaults:{
                        blankText:'with tag'
                    }
                }).render();
            }

            // Render a tag select list
            if (this.defaults.ui.withoutTags) {
                this.withoutTagsFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.withoutTags,
                    collection:this.tags,
                    defaults:{
                        blankText:'without tag'
                    }
                }).render();
            }

            return this;
        },
        remove: function() {
            if (this.customers) {
                this.customers.off();
            }
            if (this.projects) {
                this.projects.off();
            }
            if (this.services) {
                this.services.off();
            }
            if (this.tags) {
                this.tags.off();
            }
        },
        toggleFilter:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {};

            filter.open = (filter.open) ? false : true;
            $(this.defaults.ui.filter).toggle(filter.open);

            if (filter.open && !this.defaults.rendered) {
                if (this.defaults.ui.customers) {
                    this.customers.fetch();
                }
                if (this.defaults.ui.projects) {
                    this.projects.fetch();
                }
                if (this.defaults.ui.services) {
                    this.services.fetch();
                }
                if (this.defaults.ui.withTags || this.defaults.ui.withoutTags) {
                    this.tags.fetch();
                }
                this.defaults.rendered = true;
            }

            App.session.set(this.defaults.name, filter);

            return this;
        },
        updateFilter: function(defaults) {
            var filter = App.session.get(this.defaults.name) || defaults;

            if (filter) {
                // Display date
                if (this.defaults.ui.dates) {
                    var dateInput = $(this.defaults.ui.dates), dateText = $(this.defaults.ui.dates + '-text');

                    var date = moment(), text = '';
                    if (filter.date) {
                        dateInput.data('date', filter.date.format(dateInput.data('date-format')));
                        dateInput.data('date-period', filter['date-period']);
                        if (dateInput.data('datepicker')) {
                            dateInput.data('datepicker').update();
                        }

                        date = filter.date.clone();
                    } else {
                        filter.date = date.clone();
                        filter['date-period'] = dateInput.data('date-period');
                    }
                    switch (filter['date-period']) {
                        case 'D':
                            text = date.format('YYYY-MM-DD');
                            break;
                        case 'W':
                            if (date.day() === 0) {
                                date = date.subtract('days', 1);
                            }
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
                if (this.defaults.ui.customers && this.customerFilter) {
                    if (filter.customer) {
                        this.customerFilter.select(filter.customer);
                        if (this.defaults.ui.projects && this.projects) {
                            this.projects.fetch({ data: { filter: { customer: filter.customer } }, wait: true });
                        }
                    } else {
                        this.customerFilter.select('');
                        if (this.defaults.ui.projects && this.projects) {
                            this.projects.fetch({ data: {}, wait: true });
                        }
                    }
                }

                // Display projects
                if (this.defaults.ui.projects && this.projectFilter) {
                    if (filter.project) {
                        this.projectFilter.select(filter.project);
                    } else {
                        this.projectFilter.select('');
                    }
                }

                // Display services
                if (this.defaults.ui.services && this.serviceFilter) {
                    if (filter.service) {
                        this.serviceFilter.select(filter.service);
                    } else {
                        this.serviceFilter.select('');
                    }
                }

                // Display tags
                if (this.defaults.ui.withTags && this.withTagsFilter) {
                    if (filter.withTags) {
                        this.withTagsFilter.select(filter.withTags);
                    } else {
                        this.withTagsFilter.select('');
                    }
                }
                if (this.defaults.ui.withoutTags && this.withoutTagsFilter) {
                    if (filter.withoutTags) {
                        this.withoutTagsFilter.select(filter.withoutTags);
                    } else {
                        this.withoutTagsFilter.select('');
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

                // Open filter
                if (filter.open) {
                    $(this.defaults.ui.filter).show();
                }
            }

            if (this.collection) {
                this.collection.filter(filter);
                this.collection.resetPager();
                this.collection.load({ pager: true });
            }

        },
        resetFilter:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {};

            for (var name in filter) {
                if (filter.hasOwnProperty(name) && !this.defaults.preservedOnReset[name]) {
                    delete filter[name];
                }
            }

            if (this.defaults.ui.dates) {
                filter.date = moment();
                filter['date-period'] = 'W';
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
        filterWithTags:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                value = $(this.defaults.ui.withTags).val();

            if (value && value.length > 0) {
                filter.withTags = value;
            } else {
                delete filter.withTags;
            }

            App.session.set(this.defaults.name, filter);
            this.updateFilter();

            return this;
        },
        filterWithoutTags:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                value = $(this.defaults.ui.withoutTags).val();

            if (value && value.length > 0) {
                filter.withoutTags = value;
            } else {
                delete filter.withoutTags;
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
