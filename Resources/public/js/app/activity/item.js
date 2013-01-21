'use strict';

/**
 * Dime - app/activity/item.js
 */
(function ($, _, moment, App) {

  // activity item view
    App.provide('Views.Activity.Item', App.Views.Core.ListItem.extend({
        events: {
            'click .details': 'details',
            'click .edit': 'edit',
            'click .delete': 'delete',
            'click .track': 'track',
            'click': 'showDetails'
        },
        render: function() {
            var that = this;

            // grep template with jquery and generate template stub
            var temp = _.template($(this.template).html());

            // fill model date into template and push it into element html
            this.$el.html(temp({
                App: App,
                model: this.model,
                data: this.model.toJSON()
            }));

            // add element id with prefix
            this.$el.attr('id', this.elId());

            // activate timer if any running timeslice is found
            var activeTimeslice = this.model.timesliceRunning();
            if (activeTimeslice) {
                var button = $('.duration', this.$el),
                    model = this.model;

                button.data('start', moment(activeTimeslice.get('startedAt'), 'YYYY-MM-DD HH:mm:ss'));
                this.timer = setInterval(function() {
                    var d = moment().diff(button.data('start'), 'seconds');
                    button.text(model.formatDuration(button.data('duration') + d));
                }, 1000);
            }

            this.timeslices = new App.Views.Core.List({
                el: $('.box-details table tbody', this.$el),
                model:this.model,
                collection:this.model.relation('timeslices'),
                defaults:{
                    fetch: false,
                    prefix:'timeslice-',
                    emptyTemplate: '#tpl-timeslice-empty',
                    item:{
                        attributes:{ "class":"timeslice" },
                        prepend:true,
                        prependNew:true,
                        tagName:"tr",
                        View:App.Views.Timeslice.Item
                    }
                }
            }).render();

            return this;
        },
        showDetails: function(e) {
            e.preventDefault();
            e.stopPropagation();

            this.$el.toggleClass('box-folded box-unfolded');
        },
        details: function(e){
            e.stopPropagation();
        },
        edit: function(e) {
            e.stopPropagation();
        },
        'delete': function(e) {
            e.preventDefault();
            e.stopPropagation();

            // confirm destroy action
            if (window.confirm("Are you sure?")) {
                this.model.destroy({wait: true});
            }
        },
        track: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var button = $('.duration', '#' + this.elId()),
                model = this.model,
                that = this,
                activities = App.session.get('activities');


            if (!button.hasClass('btn-warning')) {
                button.data('start', moment());

                this.model.start({
                    wait: true,
                    success: function(timeslice) {
                        button.addClass('btn-warning');
                        that.timer = setInterval(function() {
                            var d = moment().diff(button.data('start'), 'seconds');
                            button.text(model.formatDuration(button.data('duration') + d));
                        }, 1000);
                        model.save({}, {success: function() {
                            model.collection.sort();
                        }});
                    }
                });
            } else {
                this.model.stop({
                    wait: true,
                    success: function (timeslice) {
                        button.removeClass('btn-warning');

                        if (that.timer) {
                            clearInterval(that.timer);
                        }
                        model.save({}, {success: function() {
                            model.collection.sort();
                        }});
                    }
                });
            }
        }
    }));

})(jQuery, _, moment, Dime);

