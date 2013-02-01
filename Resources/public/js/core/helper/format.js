'use strict';

/**
 * Dime - helper/format.js
 *
 * Register Activity model to namespace App.
 */
(function (App, $, moment) {

    App.provide('Helper.Format.Date', function(date, format) {
        date = date || new Date;
        format = format || 'YYYY-MM-DD HH:mm:ss';

        return moment(date).format(format);
    });

    /**
     * App.Helper.Format.Duration
     *
     * @param data, a duration in given unit, e.g. seconds
     * @param unit, default 'seconds' (see at moment,js)
     * @param format, default 'HH:mm:ss'
     * @return string formatted as HH:mm:ss or d HH:mm:ss when more than 24 hours
     */
    App.provide('Helper.Format.Duration', function (data, unit, format) {
        unit = unit || 'seconds';
        format = format || 'HH:mm:ss';
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


    /**
     * App.Helper.Format.Nl2Br
     *
     * @param str, convert /n to <br />
     * @return string
     */
    App.provide('Helper.Format.Nl2Br', function (str) {
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
    });


    /**
     * App.Helper.Format.Slugify
     *
     * @param text, text to slugify
     * @return string slugified text
     */
    App.provide('Helper.Format.Slugify', function (text) {
        if (text === undefined || typeof text !== 'string') throw 'Slugify need a text as parameter slugify(text).'

        text = text.toLowerCase();

        // Source: http://milesj.me/snippets/javascript/slugify
        text = text.replace(/[^-a-zA-Z0-9&\s]+/ig, '');
        text = text.replace(/-/gi, '_');
        text = text.replace(/\s/gi, '-');

        return text;
    });

    /**
     * App.Helper.Format.EditableText
     * Transform HTML Content from "contenteditable" to Text with \n
     *
     * @param html html content
     * @return string sanitized text
     */
    App.provide('Helper.Format.EditableText', function(html) {
        var ce = $("<pre />").html(html);
        if ($.browser.webkit) {
            ce.find("div").replaceWith(function() { return "\n" + this.innerHTML; });
        }
        if ($.browser.msie) {
            ce.find("p").replaceWith(function() { return this.innerHTML + "<br>"; });
        }
        if ($.browser.mozilla || $.browser.opera || $.browser.msie) {
            ce.find("br").replaceWith("\n");
        }
        return ce.text();
    })

})(Dime, jQuery, moment);

