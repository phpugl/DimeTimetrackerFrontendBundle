"use strict";

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
            'submit':'save'
        },
        initialize:function () {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this, 'save', 'updateTitle');

            this.activities = App.session.get('activities', function () {
                return new App.Collection.Activities();
            });
        },
        updateTitle:function (e) {
            var icon = $('#activity-track-date');
            icon.attr('title', icon.data('date'));

            return this;
        },
        save:function (e) {
            e.preventDefault();
            var input = $('#activity-track-input'),
                icon = $('i', '#activity-track').addClass('loading-14-white');

            var data = input.val(),
                date = $('#activity-track-date').data('date') || moment().format('YYYY-MM-DD');

            if (data && data !== "") {
                this.activities.create({parse:data, date:date}, {
                    wait:true,
                    success:function () {
                        input.val('');
                        icon.removeClass('loading-14-white');
                    }
                });
            }
        }
    }));

})(jQuery, Dime);