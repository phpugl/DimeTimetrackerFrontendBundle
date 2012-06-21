/**
 * Dime - app/activity/index.js
 */
(function ($, App) {

    // Activity index view
    App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Activities:index',
        events:{
            'click #filter-button':'toggleFilter',
            'click #filter-reset':'resetFilter',
            'changeDate #filter-date':'filterDate',
            'change #filter-customer':'filterCustomer'
        },
        initialize:function () {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            this.activities = App.session('activities');
            if (!this.activities) {
                this.activities = App.session('activities', new App.Collection.Activities());
            }

            this.customers = App.session('customers');
            if (!this.customers) {
                this.customers = App.session('customers', new App.Collection.Customers());
            }
        },
        render:function () {
            var filter = App.session('activity-filter');

            this.list = new App.Views.Core.List({
                el:'#activities',
                collection: this.activities,
                defaults:{
                    prefix:'activity-',
                    item:{
                        attributes: { "class": "activity" },
                        prepend: true,
                        tagName: "section",
                        template: '#tpl-activity-item',
                        View: App.Views.Activity.Item
                    }
                }
            }).render();

            this.customerFilter = new App.Views.Core.Select({
                el:'.filter-customer',
                collection: this.customers,
                defaults:{
                    blankText:'Filter by Customer'
                }
            });
            this.customerFilter.refetch();

            this.updateFilter();

            return this;
        },
        remove: function() {
            this.activities.off();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        },
        toggleFilter:function (e) {
            if (e) { e.preventDefault(); }

            var filter = App.session('activity-filter') || { data:{} };

            filter['open'] = (filter.open) ? false : true;
            $('#filter').toggle(filter.open);

            App.session('activity-filter', filter);

            return this;
        },
        updateFilter: function() {
            var filter = App.session('activity-filter');

            if (filter) {
                var data = {},
                    dateInput = $('#filter-date'), dateText = $('#filter-date-text');

                // Display date
                dateInput.data('date', filter['date'].format(dateInput.data('date-format')));
                dateInput.data('date-period', filter['date-period']);
                dateInput.data('datepicker').update();
                switch (filter['date-period']) {
                    case 'W':
                        var date = filter['date'].clone();
                        date = [date.day(1).format('YYYY-MM-DD'), date.day(7).format('YYYY-MM-DD')];
                        data['date'] = date;
                        dateInput.text(date.join(' - '));
                        dateText.text(date.join(' - '));
                        break;
                    case 'D':
                    case 'M':
                    case 'Y':
                        var date = filter['date'].format('YYYY-MM-DD');
                        data['date'] = date;
                        dateInput.text(date);
                        dateText.text(date);
                        break;
                }

                // Display customer
                if (filter.customer) {
                    this.customerFilter.select(filter.customer);
                    data['customer'] = filter.customer;
                } else {
                    this.customerFilter.select('');
                }

                // fetch activities
                this.activities.fetch({ data: { filter: data } });

                if (filter.open) {
                    $('#filter').show();
                }
            } else {
                this.activities.fetch();
            }
        },
        resetFilter:function (e) {
            if (e) { e.preventDefault(); }

            var filter = App.session('activity-filter') || {};

            filter['date'] = moment();
            filter['date-period'] = 'D';
            if (filter.customer) {
                delete filter.customer;
            }

            App.session('activity-filter', filter);

            this.updateFilter();
            this.toggleFilter();

            return this;
        },
        filterDate:function (e) {
            if (e) { e.preventDefault(); }

            var filter = App.session('activity-filter') || {},
                input = $('#filter-date');

            filter['date'] = moment(input.data('date')).clone();
            filter['date-period'] = input.data('date-period');

            App.session('activity-filter', filter);
            this.updateFilter();

            return this;
        },
        filterCustomer:function (e) {
            if (e) { e.preventDefault(); }

            var filter = App.session('activity-filter') || {},
                value = $('#filter-customer').val();

            if (value && value.length > 0) {
                filter['customer'] = value;
            } else {
                delete filter.customer;
            }

            App.session('activity-filter', filter);
            this.updateFilter();

            return this;
        }
    }));

})(jQuery, Dime);