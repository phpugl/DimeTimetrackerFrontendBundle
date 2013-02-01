'use strict';

/**
 * Dime - app/activity/item.js
 */
(function ($, _, moment, App) {

  // activity item view
    App.provide('Views.Activity.Item', App.Views.Core.ListItem.extend({
        events: {
            'click .edit': 'edit',
            'click .delete': 'delete',
            'click .track': 'track',
            'click .box-foldable': 'showDetails',
            'click .show-timeslices': 'showDetails'
        },
        render: function() {
            // Call parent contructor
            App.Views.Core.ListItem.prototype.render.call(this);

            // activate timer if any running timeslice is found
            var timeslice = this.model.running(true);
            if (timeslice) {
                var button = $('.duration', this.$el),
                    model = this.model;

                button.data('start', App.Helper.Format.Date(timeslice.get('startedAt')));
                this.timer = setInterval(function() {
                    var d = moment().diff(button.data('start'), 'seconds');
                    button.text(App.Helper.Format.Duration(button.data('duration') + d));
                }, 1000);
            }

            // activate contenteditable
            var ce = new App.Views.Core.Editor({
                el: this.el,
                model: this.model
            }).render();

            // show timeslice table
            this.timeslices = new App.Views.Core.List({
                el: $('.box-details table tbody', this.$el),
                model:this.model,
                collection:this.model.getRelation('timeslices'),
                options:{
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

