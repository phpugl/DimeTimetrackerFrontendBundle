'use strict';

/**
 * Dime - app/activity/item.js
 */
(function ($, _, moment, App) {

    // activity item view
    App.provide('Views.Activity.Item', App.Views.Core.ListItem.extend({
        events:{
            'click .edit':'edit',
            'click .delete':'delete',
            'click .track':'track',
            'click .box-foldable':'showDetails',
            'click .show-timeslices':'showDetails',
            'click .timeslice-checkall': 'checkAll',
            'click .timeslice-save-tags': 'saveTags'
        },
        render:function () {
            // Call parent contructor
            App.Views.Core.ListItem.prototype.render.call(this);

            // activate timer if any running timeslice is found
            var timeslice = this.model.running(true);
            if (timeslice) {
                var button = $('.duration', this.$el),
                    model = this.model;

                button.data('start', App.Helper.Format.Date(timeslice.get('startedAt')));
                this.timer = setInterval(function () {
                    var d = moment().diff(button.data('start'), 'seconds');
                    button.text(App.Helper.Format.Duration(button.data('duration') + d));
                }, 1000);
            }

            // activate contenteditable
            var ce = new App.Views.Core.Editor({
                el:this.el,
                model:this.model
            }).render();

            // show timeslice table
            this.timeslices = new App.Views.Core.List({
                el:$('.box-details table tbody', this.$el),
                model:this.model,
                collection:this.model.getRelation('timeslices'),
                options:{
                    fetch:false,
                    prefix:'timeslice-',
                    emptyTemplate:'#tpl-timeslice-empty',
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
        showDetails:function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.$el.toggleClass('box-folded box-unfolded');
        },
        details:function (e) {
            e.stopPropagation();
        },
        edit:function (e) {
            e.stopPropagation();
        },
        'delete':function (e) {
            e.preventDefault();
            e.stopPropagation();

            // confirm destroy action
            if (window.confirm("Are you sure?")) {
                this.model.destroy({wait:true});
            }
        },
        track:function (e) {
            e.preventDefault();
            e.stopPropagation();

            var button = $('.duration', '#' + this.elId()),
                model = this.model,
                that = this,
                activities = App.session.get('activities');


            if (!button.hasClass('btn-warning')) {
                button.data('start', moment());
                this.model.start({
                    wait:true,
                    success:function (timeslice) {
                        button.addClass('btn-warning');
                        that.timer = setInterval(function () {
                            var d = moment().diff(button.data('start'), 'seconds');
                            button.text(App.Helper.Format.Duration(button.data('duration') + d));
                        }, 1000);
                        model.save({}, {success:function () {
                            model.collection.sort();
                        }});
                    }
                });
            } else {
                this.model.stop({
                    wait:true,
                    success:function (timeslice) {
                        button.removeClass('btn-warning');

                        if (that.timer) {
                            clearInterval(that.timer);
                        }
                        model.save({}, {success:function () {
                            model.collection.sort();
                        }});
                    }
                });
            }
        },
        checkAll: function(e) {
            if (e) {
                e.stopPropagation();
            }

            this.$('.timeslice-checkbox').prop('checked', e.currentTarget.checked);
        },
        saveTags: function(e) {
            if (e) {
                e.stopPropagation();
            }

            var data = App.Helper.UI.Form.Serializer(this.$('.box-details')),
                timeslices = this.model.getRelation('timeslices');

            if (timeslices && data && data.tags && data.timeslice) {
                var tags = data.tags.split(' '),
                    addTags = [],
                    removeTags = [];

                // Filter tags by "-" or "+"
                for (var i=0; i<tags.length; i++) {
                    var name = tags[i].replace(/^[+-]/, '');
                    if (tags[i].search(/^-/) == -1) {
                        addTags.push(name);
                    } else {
                        removeTags.push(name);
                    }
                }

                // Save new tags
                for (var i=0; i<data.timeslice.length; i++) {
                    var ts = timeslices.get(data.timeslice[i]);
                    if (ts) {
                        var tsTags = ts.getRelation('tags');
                        if (tsTags) {
                            tags = _.union(addTags, tsTags.tagArray(removeTags));
                        } else {
                            tags = addTags;
                        }

                        ts.save({ tags: tags });
                    }
                }

                this.$('.timeslice-checkall').prop('checked', false);
                this.$('.timeslice-tags').val('');
            }
        }
    }));

})(jQuery, _, moment, Dime);

