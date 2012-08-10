'use strict';

/*
 * Dime - app/activity/track.js
 */
(function ($, App) {

    // Initialize main view - bind on <body>
    App.initialize({
        name:'activity:tracker',
        callback:function () {
            var tracker = new App.Views.Activity.Track();
            tracker.render();
        }
    });

    // Activity track input view
    App.provide('Views.Activity.Track', Backbone.View.extend({
        el:'#activity-track',
        events:{
            'changeDate #activity-track-date':'updateTitle',
            'blur #activity-track-input': 'blurInput',
            'focus #activity-track-input': 'focusInput',
            'submit':'save'
        },
        initialize:function () {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this, 'save', 'updateTitle', 'blurInput', 'focusInput');

            this.documentWidth = $(document).width();
        },
        updateTitle:function (e) {
            var icon = $('#activity-track-date');
            icon.attr('title', icon.data('date'));

            return this;
        },
        blurInput:function(e) {
            if (e) {
                var component = $(e.currentTarget);
                if (this.inputWidth) {
                    component.width(this.inputWidth);
                }
            }
        },
        focusInput:function(e) {
            if (e) {
                var component = $(e.currentTarget);
                this.inputWidth = component.width();
                if (this.documentWidth > this.inputWidth * 2) {
                    component.width(this.inputWidth * 2);
                }
            }
        },
        save:function (e) {
            e.preventDefault();
            var input = $('#activity-track-input'),
                icon = $('i', '#activity-track').addClass('loading-14-white');

            var data = input.val(),
                date = $('#activity-track-date').data('date') || moment().format('YYYY-MM-DD');

            if (data && data !== "") {
                var activity = new App.Model.Activity();

                activity.save({parse:data, date:date}, {
                    wait: true,
                    success:function (model, response) {
                        input.val('');
                        icon.removeClass('loading-14-white');

                        var activities = model.runningTimeslice() ? App.session.get('activeActivities') : App.session.get('activities');
                        if (activities) {
                            activities.add(model);
                        }
                    }
                });
            }
        }
    }));

})(jQuery, Dime);