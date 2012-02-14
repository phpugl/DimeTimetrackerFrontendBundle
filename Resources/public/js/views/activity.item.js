/**
 * Dime - views/activity.item.js
 */
(function ($, App) {

  // activity item view
  App.provide('Views.Activity.Item', App.Views.Base.Item.extend({
    prefix: 'activity-',
    template: '#tpl-activity-item',
    events: {
      'click .edit': 'edit',
      'click .delete': 'delete',
      'click .continue': 'continue',
      'click .stop': 'stop'
    },
    'continue': function() {
      var timeslices = this.model.relation('timeslices');
      timeslices.create(new App.Model.Timeslice({
        activity: this.model.get('id'),
        startedAt: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
      }));
    },
    stop: function() { 
      var timeslice = this.model.runningTimeslice();
      if (timeslice) {
        timeslice.set('stoppedAt', moment(new Date).format('YYYY-MM-DD HH:mm:ss')).save({success: function() {
            // TODO
        }, wait: true});
      }
    }
  }));

})(jQuery, Dime);

