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
        startedAtValue:function () {
            var date = $('#timeslice-startedAt-date').val(),
                time = $('#timeslice-startedAt-time').val();

            return moment(date + ' ' + time, 'YYYY-MM-DD HH:mm:ss');
        },
        stoppedAtValue:function () {
            var date = $('#timeslice-stoppedAt-date').val(),
                time = $('#timeslice-stoppedAt-time').val();

            return moment(date + ' ' + time, 'YYYY-MM-DD HH:mm:ss');
        },
        copyDate:function () {
            $('#timeslice-stoppedAt-date').val($('#timeslice-startedAt-date').val());
        },
        calculation:function (e) {
            e.preventDefault();

            var start = this.startedAtValue(),
                stop = this.stoppedAtValue(),
                duration = stop.diff(start, 'seconds');

            $('#timeslice-formatDuration').val(App.Helper.Format.Duration(duration));
        },
        render: function () {
            // Fill form
            this.form = this.$el.form();
            this.form.clear();
            this.form.fill(this.model.toJSON());

            // Render tags
            if (this.model.get('tags')) {
                var tagObjects = this.model.get('tags');
                var tags = [];
                $.each(tagObjects, function(key, el) {
                    tags[key] = el.name;
                });
                this.form.get('tags')[0].value = tags.join(' ');
            }
            
            return this;
        },
        presave: function(data) {
            if (data) {
                data.tags = data.tags.split(' ');
            }
        }
    }));

})(jQuery, moment, Dime);
