'use strict';

/**
 * Dime - core/views/filter.date.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.DatePeriod', Backbone.View.extend({
        events: {},
        parent: undefined,
        update: true,
        defaults: {
            name: 'date',
            ui: {
                period: '#filter-period',
                from: '#filter-period-from',
                to: '#filter-period-to'
            },
            events:{
                'change #filter-period': 'periodChange',
                'change #filter-period-from': 'fromChange',
                'change #filter-period-to': 'toChange'
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

            this.periodComponent = $(this.defaults.ui.period);
            this.fromComponent = $(this.defaults.ui.from);
            this.fromGroupComponent = $(this.defaults.ui.from + '-group');
            this.toComponent = $(this.defaults.ui.to);
            this.toGroupComponent = $(this.defaults.ui.to + '-group');
        },
        render: function(parent) {
            this.parent = parent;
            return this;
        },
        remove: function() {},
        updateUI: function(filter) {
            if (filter) {
                var dayFormat = 'YYYY-MM-DD';

                if (filter[this.defaults.name + '-period']) {
                    this.periodComponent.val(filter[this.defaults.name + '-period']);
                    if (!filter[this.defaults.name]) {
                        this.update = false;
                        this.periodComponent.trigger('change');
                        this.update = true;
                    }

                    switch (filter[this.defaults.name + '-period']) {
                        case 'D':
                            this.fromComponent.attr({
                                placeholder: dayFormat
                            }).data({
                                'date-format': dayFormat,
                                'date-period': 'D'
                            }).val(filter['date']);
                            if (this.fromComponent.data('datepicker')) {
                                this.fromComponent.data('datepicker').update();
                                this.fromComponent.data('datepicker').setValue();
                            }
                            this.fromGroupComponent.show();
                            this.toGroupComponent.hide();
                            break;
                        case 'W':
                            this.fromComponent.attr({
                                placeholder: dayFormat
                            }).data({
                                'date-format': dayFormat,
                                'date-period': 'W'
                            }).val(filter['date'][0]);
                            this.toComponent.val(filter['date'][1]);
                            if (this.fromComponent.data('datepicker')) {
                                this.fromComponent.data('datepicker').update();
                                this.fromComponent.data('datepicker').setValue();
                            }
                            this.fromGroupComponent.show();
                            this.toGroupComponent.show();
                            break;
                        case 'M':
                            this.fromComponent.attr({
                                placeholder: 'YYYY-MM'
                            }).data({
                                'date-format': 'YYYY-MM',
                                'date-period': 'M'
                            }).val(filter['date']);
                            if (this.fromComponent.data('datepicker')) {
                                this.fromComponent.data('datepicker').update();
                                this.fromComponent.data('datepicker').setValue();
                            }
                            this.fromGroupComponent.show();
                            this.toGroupComponent.hide();
                            break;
                        case 'Y':
                            this.fromComponent.attr({
                                placeholder: 'YYYY'
                            }).data({
                                'date-format': 'YYYY',
                                'date-period': 'Y'
                            }).val(filter['date']);
                            if (this.fromComponent.data('datepicker')) {
                                this.fromComponent.data('datepicker').update();
                                this.fromComponent.data('datepicker').setValue();
                            }
                            this.fromGroupComponent.show();
                            this.toGroupComponent.hide();
                            break;
                        case 'R':
                            this.fromComponent.attr({
                                placeholder: dayFormat
                            }).data({
                                'date-format': dayFormat,
                                'date-period': 'D'
                            }).val(filter['date'][0]);
                            this.toComponent.val(filter['date'][1]);
                            if (this.fromComponent.data('datepicker')) {
                                this.fromComponent.data('datepicker').update();
                                this.fromComponent.data('datepicker').setValue();
                            }
                            this.fromGroupComponent.show();
                            this.toGroupComponent.show();
                            break;
                        default:
                            this.fromGroupComponent.hide();
                            this.toGroupComponent.hide();
                    }
                } else {
                    this.periodComponent.val('');
                    this.fromGroupComponent.hide();
                    this.toGroupComponent.hide();
                }
            }
        },
        toggleFilter: function() {},
        resetFilter:function (filter) {
            if (filter) {
                if (filter[this.defaults.name]) {
                    delete filter[this.defaults.name];
                }
                if (filter[this.defaults.name + '-period']) {
                    delete filter[this.defaults.name + '-period'];
                }

                var settings = App.session.get('settings').values("defaultActivityFilter");
                if (settings[this.defaults.name + '-period']) {
                    filter[this.defaults.name + '-period'] = settings[this.defaults.name + '-period'];
                }
            }
        },
        periodChange: function(e) {
            if (e) {
                e.stopPropagation();
            }

            var filter = App.session.get(this.parent.defaults.name) || {},
                dayFormat = 'YYYY-MM-DD',
                select = this.periodComponent.val(),
                from = moment(this.fromComponent.data('date')).clone(),
                to = moment(this.fromComponent.data('date')).clone();

            filter['date-period'] = select;
            switch (select) {
                case 'this-month':
                    filter[this.defaults.name] = moment().format('YYYY-MM');
                    break;
                case 'this-week':
                    from = moment();
                    if (from.day() === 0) {
                        from = from.subtract('days', 1);
                    }
                    filter[this.defaults.name] = [from.day(1).format(dayFormat), from.day(7).format(dayFormat)];
                    break;
                case 'today':
                    filter[this.defaults.name] = moment().format(dayFormat);
                    break;
                case 'last-month':
                    filter[this.defaults.name] = moment().subtract('months', 1).format('YYYY-MM');
                    break;
                case 'last-week':
                    from = moment().subtract('weeks', 1);
                    if (from.day() === 0) {
                        from = date.subtract('days', 1);
                    }
                    filter[this.defaults.name] = [from.day(1).format(dayFormat), from.day(7).format(dayFormat)];
                    break;
                case 'yesterday':
                    filter[this.defaults.name] = moment().subtract('days', '1').format(dayFormat);
                    break;
                case 'D':
                    filter[this.defaults.name] = from.format(dayFormat);
                    break;
                case 'W':
                    if (from.day() === 0) {
                        from = from.subtract('days', 1);
                    }
                    filter[this.defaults.name] = [from.day(1).format(dayFormat), from.day(7).format(dayFormat)];
                    break;
                case 'M':
                    filter[this.defaults.name] = from.format('YYYY-MM');
                    break;
                case 'Y':
                    filter[this.defaults.name] = from.format('YYYY');
                    break;
                case 'R':
                    filter[this.defaults.name] = [
                        from.format(dayFormat),
                        to.format(dayFormat)
                    ];
                    break;
                default:
                    delete filter[this.defaults.name];
            }

            App.session.set(this.parent.defaults.name, filter);
            if (this.update) {
                this.parent.updateFilter();
            }

            return this;
        },
        fromChange: function(e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.parent.defaults.name) || {},
                from = this.fromComponent.val(),
                to = this.toComponent.val();

            if (from && to.length > 0) {
                if (to && to.length > 0) {
                    filter[this.defaults.name] = [from, to];
                } else {
                    filter[this.defaults.name] = from;
                }
            } else {
                delete filter[this.defaults.name];
            }

            App.session.set(this.parent.defaults.name, filter);
            this.parent.updateFilter();

            return this;
        },
        toChange: function(e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.parent.defaults.name) || {},
                from = this.fromComponent.val(),
                to = this.toComponent.val();

            if (from && to.length > 0) {
                if (to && to.length > 0) {
                    filter[this.defaults.name] = [from, to];
                } else {
                    filter[this.defaults.name] = from;
                }
            } else {
                delete filter[this.defaults.name];
            }

            App.session.set(this.parent.defaults.name, filter);
            this.parent.updateFilter();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
