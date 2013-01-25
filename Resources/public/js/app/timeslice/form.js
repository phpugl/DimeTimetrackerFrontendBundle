'use strict';

/**
 * Dime - app/timeslice/form.js
 */
(function ($, moment, App) {

    App.provide('Views.Timeslice.Form', App.Views.Core.Form.extend({
        defaults:{
            events:{
                'submit form':'save',
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close',
                'click .calculate':'calculation',
                'blur #timeslice-startedAt-date':'copyDate'
            }
        },
        render: function () {
            // Call parent contructor
            App.Views.Core.Form.prototype.render.call(this);

            // Render tags
            if (this.model.relation('tags')) {
                var tags = this.targetComponent('tags');
                tags.val(this.model.relation('tags').pluck('name').join(' '));
            }
            return this;
        },
        presave: function(data) {
            if (data) {
                if (0 < data.tags.length) {
                    data.tags = data.tags.split(' ');
                } else {
                    data.tags = [];
                }
            }
        },
        startedAtValue:function () {
            var date = this.targetComponent('startedAt-date').val(),
                time = this.targetComponent('startedAt-time').val();

            return moment(date + ' ' + time, 'YYYY-MM-DD HH:mm:ss');
        },
        stoppedAtValue:function () {
            var date = this.targetComponent('stoppedAt-date').val(),
                time = this.targetComponent('stoppedAt-time').val();

            return moment(date + ' ' + time, 'YYYY-MM-DD HH:mm:ss');
        },
        copyDate:function () {
            this.targetComponent('stoppedAt-date').val(this.targetComponent('startedAt-date').val());
        },
        calculation:function (e) {
            e.preventDefault();

            var start = this.startedAtValue(),
                stop = this.stoppedAtValue(),
                duration = stop.diff(start, 'seconds');

            this.targetComponent('formatDuration').val(App.Helper.Format.Duration(duration));
        }
    }));

})(jQuery, moment, Dime);
