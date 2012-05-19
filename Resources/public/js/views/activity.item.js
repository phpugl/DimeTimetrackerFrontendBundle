/**
 * Dime - views/activity.item.js
 */
(function ($, App) {

  // activity item view
  App.provide('Views.Activity.Item', App.Views.Base.Item.extend({
    prefix: 'activity-',
    template: '#tpl-activity-item',
    events: {
      'click .track': 'track'
    },
    render: function() {
      var _this = this;

      // grep template with jquery and generate template stub
      var temp = _.template($(this.template).html());

      // fill model date into template and push it into element html
      this.$el.html(temp({
        model: this.model,
        data: this.model.toJSON()
        }));

      // add element id with prefix
      this.$el.attr('id', this.prefix + this.model.get('id'));

      // activate timer
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

      this.$el.data('open', false);

      this.$el.click(function () {
        if (!_this.$el.data('open')) {
          $('.details', _this.$el).show();
          _this.$el.css({
            'margin-bottom': '20px'
          });
          _this.$el.data('open', true);
        } else {
          $('.details', _this.$el).hide();
          _this.$el.css({
            'margin-bottom': '0pt'
          });
          _this.$el.data('open', false);
        }
            
      });

      return this;
    },
    track: function(e) {
      e.preventDefault();
      e.stopPropagation();
            
      var button = $('.track', '#' + this.prefix + this.model.id),
      duration = $('.duration', '#' + this.prefix + this.model.id),
      model = this.model
      _this = this;
                
      if (button.hasClass('start')) {
        duration.data('start', moment());

        this.model.start({
          wait: true,
          success: function(item) {
            button
            .removeClass('start btn-success')
            .addClass('stop btn-danger');

            _this.timer = setInterval(function() {
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

            if (_this.timer) {
              clearInterval(_this.timer);
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

