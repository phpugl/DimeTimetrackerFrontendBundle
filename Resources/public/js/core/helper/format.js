/**
 * Dime - model/activity.js
 *
 * Register Activity model to namespace App.
 */
(function ($, App) {

    /**
     * App.Helper.Format.Duration
     *
     * @param data, a duration in given unit, e.g. seconds
     * @param unit, default 'seconds' (see at moment,js)
     * @return string formatted as HH:mm:ss or d HH:mm:ss when more than 24 hours
     */
    App.provide('Helper.Format.Duration', function (data, unit) {
        unit = unit || 'seconds';
        var duration = moment.duration(data, unit);
        if (duration >= 86400000) {
            return Math.floor(duration.asDays()) + 'd '
                + moment()
                .hours(duration.hours())
                .minutes(duration.minutes())
                .seconds(duration.seconds())
                .milliseconds(duration.milliseconds())
                .format('HH:mm:ss');
        } else {
            return moment()
                .hours(duration.hours())
                .minutes(duration.minutes())
                .seconds(duration.seconds())
                .milliseconds(duration.milliseconds())
                .format('HH:mm:ss');
        }
    });

    /**
     * App.Helper.Format.Truncate
     *
     * @param text, text to truncate
     * @param length, default: 30
     * @param endChars, default: '...'
     * @return string truncate at first line break and after given length
     */
    App.provide('Helper.Format.Truncate', function (text, length, endChars) {
        length = length || 30;
        endChars = endChars || '...';

        var result = /(.*)\n?/.exec(text);

        if (result && result[1]) {
            return (result[1].length > length) ? result[1].substr(0, 30) + endChars : result[1];
        } else {
            return text;
        }
    });

})(jQuery, Dime);

