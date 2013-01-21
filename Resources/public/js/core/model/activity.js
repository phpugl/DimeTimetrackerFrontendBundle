'use strict';

/**
 * Dime - core/model/activity.js
 *
 * Register Activity model to namespace App.
 */
(function ($, Backbone, _, moment, App) {

    // Create Activity model and add it to App.Model
    App.provide('Model.Activity', App.Model.Base.extend({
        urlRoot:App.Route.Activities,
        defaults:{
            duration:0
        },
        relations: {
            customer: {
                model: 'App.Model.Customer'
            },
            project: {
                model: 'App.Model.Project'
            },
            service: {
                model: 'App.Model.Service'
            },
            timeslices: {
                collection: 'App.Collection.Timeslices',
                model: 'App.Model.Timeslice',
                belongTo: 'activity:id'
            },
            tags: {
                collection: 'App.Collection.Tags',
                model: 'App.Model.Tag'
            }
        },
        start:function (opt) {
            var timeslices = this.relation('timeslices');
            if (timeslices && !timeslices.firstRunning()) {
                timeslices.create(new App.Model.Timeslice({
                    activity:this.get('id'),
                    startedAt:moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                }), opt);
            }
        },
        stop:function (opt) {
            var timeslices = this.relation('timeslices');
            if (timeslices && timeslices.firstRunning()) {
                var timeslice = timeslices.firstRunning();
                timeslice.save(
                    {
                        'stoppedAt':moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                    },
                    opt
                );
            }
        },
        shortDescription:function (length, endChars) {
            return (this.get('description')) ? App.Helper.Format.Truncate(this.get('description'), length, endChars) : '<no description>';
        },
        addTimeslice: function (timeslice) {
            if (timeslice && this.relation('timeslices')) {
                var timeslices = this.relation('timeslices');
                timeslices.add(timeslice);
                this.set('duration', timeslices.duration());
            }
        },
        timesliceRunning:function () {
            return (this.relation('timeslices')) ? this.relation('timeslices').firstRunning() : undefined;
        },
        timesliceDuration: function() {
            if (this.relation('timeslices')) {
                return this.relation('timeslices').duration();
            }
            return 0;
        },
        formatDuration:function (seconds) {
            return App.Helper.Format.Duration(seconds);
        }
    }));

})(jQuery, Backbone, _, moment, Dime);

