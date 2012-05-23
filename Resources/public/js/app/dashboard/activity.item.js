/**
 * Dime - views/activity.item.js
 */
(function ($, App) {

  // activity item view
  App.provide('Views.Activity.Item', Backbone.View.extend({
    template: '#tpl-activity-item',
    events: {
      'click .edit': 'edit',
      'click .delete': 'delete',
      'click .track': 'track'
    },
    defaults: {
      prefix: 'activity-'
    },
    initialize: function(opt) {
      // Bind all to this, because you want to use
      // "this" view in callback functions
      _.bindAll(this);

      // Grep default values from option
      if (opt && opt.defaults) {
        this.defaults = _.extend({}, this.defaults, opt.defaults);
      }

      // bind remove function to model
      this.model.bind('destroy', this.remove, this);
    },
    elId: function() {
      var id = this.$el.attr('id');
      return (id) ? id : this.defaults.prefix + this.model.get('id');
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

      // open item and show details
      this.$el
        .data('open', false)
        .click(function () {
          if (!that.$el.data('open')) {
            $('.details', that.$el).show();
            that.$el.css('margin-bottom', '20px').data('open', true);
          } else {
            $('.details', that.$el).hide();
            that.$el.css('margin-bottom', '0pt').data('open', false);
          }
        });

      return this;
    },
    edit: function(e) {
      e.preventDefault();
      e.stopPropagation();

      App.UI.router.navigate("activity/edit/" + this.model.id, true);
    },
    'delete': function(e) {
      e.preventDefault();
      e.stopPropagation();

      // confirm destroy action
      if (confirm("Are you sure?")) {
        this.model.destroy({wait: true});
      }
    },
    track: function(e) {
      e.preventDefault();
      e.stopPropagation();
            
      var button = $('.track', '#' + this.elId()),
          duration = $('.duration', '#' + this.elId()),
          model = this.model,
          that = this;
                
      if (button.hasClass('start')) {
        duration.data('start', moment());

        this.model.start({
          wait: true,
          success: function(item) {
            button
            .removeClass('start btn-success')
            .addClass('stop btn-danger');

            that.timer = setInterval(function() {
              var d = moment().diff(duration.data('start'), 'seconds');
              duration.text(model.formatDuration(duration.data('duration') + d));
            }, 1000);
                        
          }
        });
      } else if (button.hasClass('stop')) {
        this.model.stop({
          wait: true,
          success: function (item) {
            button
            .removeClass('stop btn-danger')
            .addClass('start btn-success');

            if (that.timer) {
              clearInterval(that.timer);
            }
                        
            var d = duration.data('duration');
            d += item.get('duration');
            duration.data('duration', d);
            duration.text(model.formatDuration(d));
          }
        });
      }
    }
  }));

})(jQuery, Dime);

