/**
 * Dime - model/activity.js
 *
 * Register Activity model to namespace App.
 */
(function ($, App) {

    // Create Activity model and add it to App.Model
    App.provide('Model.Activity', Backbone.Model.extend({
        urlRoot: App.Route.Activities,
        defaults: {
            duration: 0
        },
        relation: function(name) {
            var relation = this.get('relation');
            if (name) {
                return (relation && relation[name]) ? relation[name] : undefined;
            } else {
                return relation;
            }
        },
        parse: function(response) {
            response.relation = {};

            if (response.customer) {
                response.relation.customer = new App.Model.Customer(response.customer)
                response.customer = response.customer.id;
            }

            if (response.project) {
                response.relation.project = new App.Model.Project(response.project)
                response.project = response.project.id;
            }

            if (response.service) {
                response.relation.service = new App.Model.Service(response.service)
                response.service = response.service.id;
            }

            var timeslices = new App.Collection.Timeslices();
            if (response.timeslices) {
                var slices = [];
                _.each(response.timeslices, function(item) {
                    slices[slices.length] = item.id;
                    item.activity = response.id;
                    timeslices.add(new App.Model.Timeslice(item));
                });
                response.duration = timeslices.duration();
                response.timeslices = slices;
            }
            response.relation.timeslices = timeslices;

            return response;
        },
        start: function(opt) {
            var timeslices = this.relation('timeslices');
            if (timeslices && !timeslices.firstRunning()) {
                timeslices.create(new App.Model.Timeslice({
                    activity: this.get('id'),
                    startedAt: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                }), opt);
            }
        },
        stop: function(opt) {
            var timeslices = this.relation('timeslices');
            if (timeslices && timeslices.firstRunning()) {
                var timeslice = timeslices.firstRunning();
                timeslice.save(
                    {
                        'stoppedAt': moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                    },
                    opt
                );
            }
        },
        runningTimeslice: function() {
            return (this.relation('timeslices')) ? this.relation('timeslices').firstRunning() : undefined;
        },
        formatDuration: function(seconds) {
            var duration = moment.duration(seconds, 'seconds');
            return moment()
                .hours(duration.hours())
                .minutes(duration.minutes())
                .seconds(duration.seconds())
                .format('HH:mm:ss');
        }
    }));

})(jQuery, Dime);

