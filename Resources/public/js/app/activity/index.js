'use strict';

/**
 * Dime - app/activity/index.js
 */
(function ($, Backbone, _, moment, App) {

    // Activity index view
    App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
        events: {
            'click .toggle-filter': 'toggleFilter'
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
            this.filter = new App.Views.Core.Filter.Form({
                el: '#activity-filter',
                collection: this.activities,
                template:'DimeTimetrackerFrontendBundle:Activities:filter',
                options: {
                    name: 'activity-filter',
                    items: {
                        dates: new App.Views.Core.Filter.DatePeriod(),
                        customer: new App.Views.Core.Filter.Customer(),
                        project: new App.Views.Core.Filter.Project({
                            options: {
                                collection: App.Collection.Services,
                                sessionKey: 'service-filter-collection',

                            }
                        }),
                        service: new App.Views.Core.Filter.Service(),
                        search: new App.Views.Core.Filter.Search(),
                        tags: new App.Views.Core.Filter.Tags()
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
                        attributes:{ "class":"activity box box-folded" },
                        prependNew:true,
                        tagName:"section",
                        template:'#tpl-activity-item',
                        View:App.Views.Activity.Item
                    }
                }
            }).render();

            // fetch filter settings
            this.filter.updateFilter();

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
        toggleFilter: function(e) {
            if (e) {
                e.stopPropagation();
            }

            if (this.filter) {
                this.filter.toggleFilter(e);
            }

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
