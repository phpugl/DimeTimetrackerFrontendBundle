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
                    that.filterSettings = {};
                    var defaultFilterSettings = settings.where({ "namespace": "defaultActivityFilter" });
                    console.log(defaultFilterSettings);
                    defaultFilterSettings.forEach(function (setting) {
                        that.filterSettings[setting.attributes.name] = setting.attributes.value;
                    });
                    that.filterSettings.active = false;
                    console.log(that.filterSettings);
                    App.session.set('activity-filter', that.filterSettings);
                    that.filter.updateFilter();
                }
            });

            return this;
        },
        remove:function () {
            // Unbind events
            this.activities.off();
            this.activeActivities.off();

            this.activeList.remove();
            this.list.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
