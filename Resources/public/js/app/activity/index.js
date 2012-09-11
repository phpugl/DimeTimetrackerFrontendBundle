'use strict';

/**
 * Dime - app/activity/index.js
 */
(function ($, Backbone, _, moment, App) {

    // Activity index view
    App.provide('Views.Activity.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Activities:index',
        initialize:function () {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            this.activities = App.session.get('activities', function () {
                return new App.Collection.Activities();
            });

            this.activeActivities = App.session.get('activeActivities', function () {
                return new App.Collection.Activities();
            });

            this.availableTags = App.session.get('availableTags', function () {
                return new App.Collection.Tags();
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

            // Render active activities
            this.activeList = new App.Views.Core.List({
                el: '#activities-active',
                collection:this.activeActivities,
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
            this.activeActivities.fetch({ data: { filter: { active: true } } });

            // Render tags list
            this.tags = new App.Views.Core.List({
                el:'#tag-list',
                collection:this.availableTags,
                defaults:{
                    prefix:'tag-',
                    item:{
                        attributes:{ "class":"tag" },
                        prependNew:true,
                        tagName:"section",
                        template:'#tpl-tag-item',
                        View:App.Views.Tag.Item
                    }
                }
            }).render();
            this.availableTags.fetch({ data: {} });

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
            App.session.set('activity-filter', {date: moment(), 'date-period': 'W', active: false });
            this.filter.updateFilter();

            return this;
        },
        remove:function () {
            // Unbind events
            this.activities.off();
            this.activeActivities.off();

            this.activeList.remove();
            this.list.remove();
            this.tags.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
