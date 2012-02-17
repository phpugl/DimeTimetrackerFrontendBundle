/**
 * Dime - views/activity.item.js
 */
(function ($, App) {

  // activity item view
  App.provide('Views.Activity.Item', App.Views.Base.Item.extend({
    prefix: 'activity-',
    template: '#tpl-activity-item',
    events: {
      'click .timeslice-new': 'add',
      'click .edit': 'edit',
      'click .delete': 'delete',
      'click .track': 'track'
    },
    add: function() {
      var timesliceForm = new App.Views.Timeslice.Form({
        el: '#timeslice-form',
        collection: this.model.relation('timeslices'),
        model: new App.Model.Timeslice({activity: this.model.get('id') })
      });
      timesliceForm.render();

    },
    track: function() {
      var button = $('.track', '#' + this.prefix + this.model.id),
          duration = $('.duration', '#' + this.prefix + this.model.id),
          model = this.model;
      if (button.hasClass('start')) {
        this.model.start({wait: true, success: function(item) {
            button
            .removeClass('start btn-success')
            .addClass('stop btn-danger')
            .text('Stop');
        }});
      } else if (button.hasClass('stop')) {
        this.model.stop({wait: true, success: function (item) {
           button
            .removeClass('stop btn-danger')
            .addClass('start btn-success')
            .text('Continue');

           var d = duration.data('duration');
            d += item.get('duration');
            duration.data('duration', d);
            duration.text(model.formatDuration(d));
        }});
      }
    }
  }));

})(jQuery, Dime);

