'use strict';

/**
 * Dime - app/activity/index.js
 */
(function ($, Backbone, _, moment, App) {

    // Activity index view
    App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
        events: {
            'click .toggle-options': 'toggleOptions'
        },
        template:'DimeTimetrackerFrontendBundle:Activities:index',
        initialize:function () {
            this.activities = App.session.get('activities', function () {
                return new App.Collection.Activities();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Form.Filter({
                el: '#activity-filter',
                collection: this.activities,
                template: 'DimeTimetrackerFrontendBundle:Activities:filter',
                options: {
                    name: 'activity-filter',
                    widgets: {
                        dateperiod: new App.Views.Core.Widget.DatePeriod({
                            options: {
                                templateEl: '#filter-date-period'
                            }
                        }),
                        customer: new App.Views.Core.Widget.Select({
                            collection: App.session.get('customer-filter-collection', function () {
                                return new App.Collection.Customers();
                            }),
                            options: {
                                templateEl: '#filter-customer',
                                blankText: 'by customer'
                            }
                        }),
                        project: new App.Views.Core.Widget.Select({
                            collection: App.session.get('project-filter-collection', function () {
                                return new App.Collection.Projects();
                            }),
                            options: {
                                templateEl: '#filter-project',
                                blankText: 'by project'
                            }
                        }),
                        service: new App.Views.Core.Widget.Select({
                            collection: App.session.get('service-filter-collection', function () {
                                return new App.Collection.Services();
                            }),
                            options: {
                                templateEl: '#filter-service',
                                blankText: 'by service'
                            }
                        }),
                        withTags: new App.Views.Core.Widget.Select({
                            collection: App.session.get('tag-filter-collection', function () {
                                return new App.Collection.Tags();
                            }),
                            options: {
                                templateEl: '#filter-withTags',
                                blankText: 'with tag'
                            }
                        }),
                        withoutTags: new App.Views.Core.Widget.Select({
                            collection: App.session.get('tag-filter-collection', function () {
                                return new App.Collection.Tags();
                            }),
                            options: {
                                templateEl: '#filter-withoutTags',
                                blankText: 'without tag'
                            }
                        })
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
                options:{
                    prefix:'activity-',
                    emptyTemplate: '#tpl-activity-empty',
                    item:{
                        attributes:{ "class":"activity box box-folded" },
                        prependNew:true,
                        tagName:"section",
                        template:'#tpl-activity-item',
                        View:App.Views.Activity.Item
                    }
                }
            }).render();

            // fetch filter settings
            var settings = App.session.get('settings');
            if (settings && settings.hasSetting('system', 'activity-filter')) {
                this.filter.bind(settings.getSetting('system', 'activity-filter'));
            }
            this.filter.submit();

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
        toggleOptions: function(e) {
            if (e) {
                e.stopPropagation();
            }

            this.$('#activity-filter').toggle();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
