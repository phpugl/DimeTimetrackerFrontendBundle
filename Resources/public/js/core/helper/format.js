/**
 * Dime - model/activity.js
 *
 * Register Activity model to namespace App.
 */
(function ($, App) {

  // Create Activity model and add it to App.Model
  App.provide('Helper.Format.Duration', function(data, unit) {
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

})(jQuery, Dime);

