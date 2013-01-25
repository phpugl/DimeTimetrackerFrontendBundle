'use strict';

/**
 * Dime - core/model/timeslice.js
 *
 * Register Timeslice model to namespace App.
 */
(function ($, Backbone, App, moment) {

    // create Timeslice model and add it to App.Model
    App.provide('Model.Timeslice', App.Model.Base.extend({
        urlRoot:App.Route.Timeslices,
        defaults:{
            duration:0,
            startedAt:undefined,
            stoppedAt:undefined
        },
        relations:{
            activity:{
                model:'App.Model.Activity'
            },
            tags: {
                collection: 'App.Collection.Tags',
                model: 'App.Model.Tag'
            }
        },
        parse:function (response) {
            // Call parse from extend object
            response = App.Model.Base.prototype.parse.call(this, response);

            // look for duration and format it
            if (response.duration !== undefined) {
                response.formatDuration = App.Helper.Format.Duration(response.duration);
            }

            // split datetime into date and time
            if (response.startedAt) {
                var startedAt = moment(response.startedAt, 'YYYY-MM-DD HH:mm:ss"');
                response['startedAt-date'] = startedAt.format('YYYY-MM-DD');
                response['startedAt-time'] = startedAt.format('HH:mm:ss');
            }

            // split datetime into date and time
            if (response.stoppedAt) {
                var stoppedAt = moment(response.stoppedAt, 'YYYY-MM-DD HH:mm:ss"');
                response['stoppedAt-date'] = stoppedAt.format('YYYY-MM-DD');
                response['stoppedAt-time'] = stoppedAt.format('HH:mm:ss');
            }

            return response;
        },
        validate:function (attrs) {
            var format = 'YYYY-MM-DD HH:mm:ss';

            if (attrs.duration && !attrs["startedAt-time"] && !attrs["stoppedAt-time"]) {
                this.set({
                    startedAt:moment(attrs["startedAt-date"] + ' 00:00:00', format).format(format),
                    stoppedAt:moment(attrs["startedAt-date"] + ' 00:00:00', format).format(format)
                }, {silent:true});
            } else {
                // concat date and time to one string
                if (attrs["startedAt-date"] && attrs["startedAt-time"]) {
                    this.set({
                        startedAt:moment(attrs["startedAt-date"] + ' ' + attrs["startedAt-time"], format).format(format)
                    }, {silent:true});
                }

                // concat date and time to one string
                if (attrs["stoppedAt-date"] && attrs["stoppedAt-time"]) {
                    this.set({
                        stoppedAt:moment(attrs["stoppedAt-date"] + ' ' + attrs["stoppedAt-time"], format).format(format)
                    }, {silent:true});
                }
            }
        },
        isRunning:function () {
            return this.get('duration') <= 0
                && !(this.get('stoppedAt') && this.get('stoppedAt').length > 0);
        },
        formatDuration:function () {
            return App.Helper.Format.Duration(this.get('duration'));
        }
    }));

})(window.jQuery, window.Backbone, window.Dime, window.moment);

