'use strict';

/**
 * Dime - app/activity/index.js
 */
(function ($, Backbone, _, moment, App) {

    // Activity index view
    App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
        events: {
            'change #filter-period': 'period'
        },
        template:'DimeTimetrackerFrontendBundle:Activities:index',
        initialize:function () {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            this.activities = App.session.get('activities', function () {
                return new App.Collection.Activities();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter({
                el: this.el,
                collection: this.activities,
                defaults: {
                    name: 'activity-filter',
                    preservedOnReset: {
                        open: true,
                        active: true
                    },
                    ui: {
                        dates: '.filter-date'
                    },
                    events:{
                        'changeDate .filter-date':'filterDate'
                    }
                }
            }).render();

            // Render pager
            this.pager = new App.Views.Core.Pager({
                collection: this.activities
            });
            $('.pagination').html(this.pager.render().el);

            // Render activities list
            this.list = new App.Views.Core.List({
                el:'#activities',
                collection:this.activities,
                defaults:{
                    prefix:'activity-',
                    emptyTemplate: '#tpl-activity-empty',
                    item:{
                        attributes:{ "class":"activity" },
                        prependNew:true,
                        tagName:"section",
                        template:'#tpl-activity-item',
                        View:App.Views.Activity.Item
                    }
                }
            }).render();

            // fetch filter settings
            this.settings = new App.Collection.Settings();
            var that = this;
            this.settings.fetch({
                success: function(settings, response, options) {
                    that.filterSettings = { date : moment(), active : false };
                    var defaultFilterSettings = settings.where({ "namespace": "defaultActivityFilter" });
                    defaultFilterSettings.forEach(function (setting) {
                        that.filterSettings[setting.attributes.name] = setting.attributes.value;
                    });
                    App.session.set('activity-filter', that.filterSettings);
                    that.filter.updateFilter();
                }
            });

            return this;
        },
        remove:function () {
            // Unbind events
            this.activities.off();

            this.list.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        },
        period: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var fromGroup = $('#filter-from-group'),
                from = $('#filter-period-from', fromGroup),
                toGroup = $('#filter-to-group');

            if (e.currentTarget) {
                switch (e.currentTarget.value) {
                    case 'D':
                        from.attr({
                            placeholder: 'YYYY-MM-DD'
                        }).data({
                                'date-format': 'YYYY-MM-DD',
                                'date-period': 'D'
                            });
                        if (from.data('datepicker')) {
                            from.data('datepicker').update();
                            from.data('datepicker').setValue();
                        }
                        fromGroup.show();
                        toGroup.hide();
                        break;
                    case 'W':
                        from.attr({
                            placeholder: 'YYYY-MM-DD'
                        }).data({
                                'date-format': 'YYYY-MM-DD',
                                'date-period': 'W'
                            });
                        if (from.data('datepicker')) {
                            from.data('datepicker').update();
                            from.data('datepicker').setValue();
                        }
                        fromGroup.show();
                        toGroup.hide();
                        break;
                    case 'M':
                        from.attr({
                            placeholder: 'YYYY-MM'
                        }).data({
                                'date-format': 'YYYY-MM',
                                'date-period': 'M'
                            });
                        if (from.data('datepicker')) {
                            from.data('datepicker').update();
                            from.data('datepicker').setValue();
                        }
                        fromGroup.show();
                        toGroup.hide();
                        break;
                    case 'Y':
                        from.attr({
                            placeholder: 'YYYY'
                        }).data({
                                'date-format': 'YYYY',
                                'date-period': 'Y'
                            });
                        if (from.data('datepicker')) {
                            from.data('datepicker').update();
                            from.data('datepicker').setValue();
                        }
                        fromGroup.show();
                        toGroup.hide();
                        break;
                    case 'R':
                        from.attr({
                            placeholder: 'YYYY-MM-DD'
                        }).data({
                                'date-format': 'YYYY-MM-DD',
                                'date-period': 'D'
                            });
                        if (from.data('datepicker')) {
                            from.data('datepicker').update();
                            from.data('datepicker').setValue();
                        }
                        fromGroup.show();
                        toGroup.show();
                        break;
                    default:
                        fromGroup.hide();
                        toGroup.hide();
                }
            }
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
