'use strict';

/**
 * Dime - app/activity/index.js
 */
(function ($, Backbone, _, App) {

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
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter({
                el: this.el,
                collection: this.activities,
                defaults: {
                    name: 'activity-filter'
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

            this.filter.updateFilter();

            return this;
        },
        remove:function () {
            this.activities.off();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        }
    }));

})(jQuery, Backbone, _, Dime);