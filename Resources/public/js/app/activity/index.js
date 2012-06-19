/**
 * Dime - app/activity/index.js
 */
(function ($, App) {
 
  // Activity index view
  App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
    template: 'DimeTimetrackerFrontendBundle:Activities:index',
    events: {
      'click #filter-button': 'toggleFilter',
      'changeDate #filter-date': 'filterDate',
      'change #filter-customer': 'filterCustomer'
    },
    initialize: function() {
      this.activities = App.session('activities');
      if (!this.activities) {
        this.activities = App.session('activities', new App.Collection.Activities());
      }
    },
    render: function() {
      this.list = new App.Views.Core.List({
        el: '#activities',
        collection: this.activities,
        defaults: {
          prefix: 'activity-',
          item: {
            attributes: { "class": "activity" },
            prepend: true,
            tagName: "section",
            View: App.Views.Activity.Item
          }
          
        }
      }).render();
      var filter = App.session('activity-filter');
      this.activities.fetch({data: { filter: filter } });

      var customers = App.session('customers');
      if (!customers) {
        customers = App.session('customers', new App.Collection.Customers());
      }
      var selectBox = new App.Views.Core.Select({
        el: '.filter-customer',
        collection: customers,
        defaults: {
          selected: (filter && filter['customer']) ? filter['customer'] : undefined,
          blankText: 'Filter by Customer'
        }
      });
      selectBox.refetch();

    },
    toggleFilter: function(e) {
        e.preventDefault();
        $('#filter').toggle();
    },
    filterDate: function(e) {
        e.preventDefault();
        var filter = App.session('activity-filter') || {},
            input = $('#filter-date'),
            date = moment(input.data('datepicker').date).clone();

        switch(input.data('datepicker').period) {
            case 'D':
                filter['date'] = date.format('YYYY-MM-DD');
                input.text(filter['date']);
                break;
            case 'W':
                filter['date'] = [date.day(1).format('YYYY-MM-DD'), date.day(7).format('YYYY-MM-DD')];
                input.text(filter['date'].join(' - '));
                break;
            case 'M':
                filter['date'] = date.format('YYYY-MM');
                input.text(filter['date']);
                break;
            case 'Y':
                filter['date'] = date.format('YYYY');
                input.text(filter['date']);
                break;
        }

        App.session('activity-filter', filter);
        this.activities.fetch({data: { filter: filter } });
    },
    filterCustomer: function(e) {
        e.preventDefault();
        var filter = App.session('activity-filter') || {},
            value = $('#filter-customer').val();

        if (value && value.length > 0) {
            filter['customer'] = $('#filter-customer').val();
        } else {
            delete filter.customer;
        }

        App.session('activity-filter', filter);
        this.activities.fetch({data: { filter: filter } });
    }
  }));

})(jQuery, Dime);