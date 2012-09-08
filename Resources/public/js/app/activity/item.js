'use strict';

/**
 * Dime - app/activity/item.js
 */
(function ($, _, moment, App) {

  // activity item view
    App.provide('Views.Activity.Item', App.Views.Core.ListItem.extend({
        events: {
            'click .edit': 'edit',
            'click .delete': 'delete',
            'click .track': 'track',
            'click': 'showDetails'
        },
        render: function() {
            var that = this;

            // grep template with jquery and generate template stub
            var temp = _.template($(this.template).html());

            // fill model date into template and push it into element html
            this.$el.html(temp({
                model: this.model,
                data: this.model.toJSON()
            }));

            // add element id with prefix
            this.$el.attr('id', this.elId());

            // activate timer if any running timeslice is found
            var activeTimeslice = this.model.runningTimeslice();
            if (activeTimeslice) {
                var duration = $('.duration', this.$el),
                    model = this.model;

                duration.data('start', moment(activeTimeslice.get('startedAt'), 'YYYY-MM-DD HH:mm:ss'));
                this.timer = setInterval(function() {
                    var d = moment().diff(duration.data('start'), 'seconds');
                    duration.text(model.formatDuration(duration.data('duration') + d));
                }, 1000);
            }
            return this;
        },
        showDetails: function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('.details', this.el).toggle();
            this.$el.toggleClass('gap-20');
        },
        edit: function(e) {
            e.stopPropagation();
        },
        'delete': function(e) {
            e.preventDefault();
            e.stopPropagation();

            // confirm destroy action
            if (window.confirm("Are you sure?")) {
                this.model.destroy({wait: true});
            }
        },
        track: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var button = $('.track', '#' + this.elId()),
                duration = $('.duration', '#' + this.elId()),
                model = this.model,
                that = this,
                activities = App.session.get('activities'),
                activeActivities = App.session.get('activeActivities');


            if (button.hasClass('start')) {
                duration.data('start', moment());

                this.model.start({
                    wait: true,
                    success: function(timeslice) {
                        button
                            .removeClass('start btn-success')
                            .addClass('stop btn-danger');

                        if (activities) {
                            activities.remove(model);
                        }
                        if (activeActivities) {
                            activeActivities.add(model);
                        }
                    }
                });
            } else if (button.hasClass('stop')) {
                this.model.stop({
                    wait: true,
                    success: function (timeslice) {
                        button
                            .removeClass('stop btn-danger')
                            .addClass('start btn-success');

                        if (that.timer) {
                            clearInterval(that.timer);
                        }

                        model.addTimeslice(timeslice);
                        if (activities) {
                            activities.add(model);
                        }
                        if (activeActivities) {
                            activeActivities.remove(model);
                        }
                    }
                });
            }
        }
    }));

})(jQuery, _, moment, Dime);

