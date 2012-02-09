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
      var newModel = new App.Model.Activity(this.model.toJSON());
      newModel.unset('id');
      newModel.unset('stoppedAt');
      newModel.unset('duration');
      newModel.unset('user');

      // @TODO
      if (newModel.get('customer') && newModel.get('customer').id) {
          newModel.set('customer', newModel.get('customer').id);
      }
      if (newModel.get('project') && newModel.get('project').id) {
          newModel.set('project', newModel.get('project').id);
      }
      if (newModel.get('service') && newModel.get('service').id) {
          newModel.set('service', newModel.get('service').id);
      }
      newModel.set('started_at', moment(new Date).format('YYYY-MM-DD HH:mm:ss'));
      this.model.collection.create(newModel, {wait: true});
    },
    stop: function() {

      // @TODO
      if (this.model.get('customer') && this.model.get('customer').id) {
          this.model.set('customer', this.model.get('customer').id);
      }
      if (this.model.get('project') && this.model.get('project').id) {
          this.model.set('project', this.model.get('project').id);
      }
      if (this.model.get('service') && this.model.get('service').id) {
          this.model.set('service', this.model.get('service').id);
      }
      this.model.set('stoppedAt', moment(new Date).format('YYYY-MM-DD HH:mm:ss')).save();
    }
  }));

})(jQuery, Dime);

