"use strict";
/**
 * Dime - model/timeslice.js
 *
 * Register Timeslice model to namespace App.
 */
(function ($, App) {

    // create Timeslice model and add it to App.Model
    App.provide('Model.Timeslice', Backbone.Model.extend({
        urlRoot:App.Route.Timeslices,
        defaults:{
            duration:0,
            startedAt: undefined,
            stoppedAt: undefined
        },
        relation:function (name, item, defaultValue) {
            var relation = this.get('relation'),
                result = defaultValue;

            if (name) {
                if (relation && relation[name]) {
                    if (item && relation[name].get(item)) {
                        result = relation[name].get(item);
                    } else {
                        result = relation[name];
                    }
                    return result;
                } else {
                    return undefined;
                }
            } else {
                return relation;
            }
        },
        prefillDate: function(name, value) {
            var date = moment(value, 'YYYY-MM-DD HH:mm:ss'),
                data = {};

            data[name + '-date'] = date.format('YYYY-MM-DD');

            this.set(data, {silent: true});

            return this;
        },
        parse:function (response) {
            // bind activity relation
            response.relation = {};
            if (response.activity) {
                response.relation.activity = new App.Model.Activity(response.activity);
                response.activity = response.activity.id;
            }

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
            // concat date and time to one string
            this.set({ startedAt: moment(attrs["startedAt-date"] + ' ' + attrs["startedAt-time"]).format('YYYY-MM-DD HH:mm:ss') }, {silent:true});

            // concat date and time to one string
            this.set({ stoppedAt: moment(attrs["stoppedAt-date"] + ' ' + attrs["stoppedAt-time"]).format('YYYY-MM-DD HH:mm:ss') }, {silent:true});
        },
        isRunning:function () {
            return this.get('duration') <= 0
                && !(this.get('stoppedAt') && this.get('stoppedAt').length > 0);
        },
        formatDuration:function () {
            return App.Helper.Format.Duration(this.get('duration'));
        }
    }));

})(jQuery, Dime);

