'use strict';

/**
 * Dime - core/views/pager.js
 */
(function ($, Backbone, _, App) {

    // Create list item view in App.Views.Core
    App.provide('Views.Core.PagerItem', Backbone.View.extend({
        tagName: 'li',
        events: {
            'click': 'update'
        },
        text: '',
        current: false,
        initialize:function (opt) {
            _.bindAll(this, 'render', 'update');

            if (opt) {
                if (opt.text) {
                    this.text = opt.text;
                }

                this.current = (opt.current) ? true : false;
            }
        },
        render:function () {
            this.$el.data('page', this.text).text(this.text).wrapInner('<a />');
            if (this.current) {
                this.$el.addClass('active');
            }
            return this;
        },
        update:function() {
            this.collection.setPage(this.$el.data('page'));
        }
    }));

    App.provide('Views.Core.PagerNext', Backbone.View.extend({
        tagName: 'li',
        events: {
            'click': 'update'
        },
        text: '',
        initialize:function (opt) {
            _.bindAll(this, 'render', 'update');
            if (opt) {
                if (opt.text) {
                    this.text = opt.text;
                }
            }
        },
        render:function () {
            this.$el.html('<a title="' + this.text + '"><i class="icon-chevron-right hide-text">' + this.text + '</i></a>');
            return this;
        },
        update:function() {
            this.collection.nextPage();
        }
    }));

    App.provide('Views.Core.PagerPrev', Backbone.View.extend({
        tagName: 'li',
        events: {
            'click': 'update'
        },
        text: '',
        initialize:function (opt) {
            _.bindAll(this, 'render', 'update');
            if (opt) {
                if (opt.text) {
                    this.text = opt.text;
                }
            }
        },
        render:function (text) {
            this.$el.html('<a title="' + this.text + '"><i class="icon-chevron-left hide-text">' + this.text + '</i></a>');
            return this;
        },
        update:function() {
            this.collection.prevPage();
        }
    }));


    // provide list view in App.Views.Core
    App.provide('Views.Core.Pager', Backbone.View.extend({
        tagName: 'ul',
        itemViews: [],
        initialize:function (opt) {
            _.bindAll(this, 'render', 'remove', 'addView');

            if (this.collection) {
                this.collection.on('reset', this.render, this);
            }
        },
        render:function () {
            // clear pager
            for (var i=0; i<this.itemViews.length; i++) {
                this.itemViews[i].remove();
            }
            this.itemViews = [];
            this.$el.html('');

            var pager = this.collection.getPager();
            if (pager.prev) {
                this.addView(new App.Views.Core.PagerPrev({
                    collection: this.collection,
                    text: 'Prev'
                }));
            }

            if (pager.total > 1) {
                for (i=1; i<=pager.total; i++) {
                    this.addView(new App.Views.Core.PagerItem({
                        collection: this.collection,
                        text: i,
                        current: (i==pager.current)
                    }));
                }
            }

            if (pager.next) {
                this.addView(new App.Views.Core.PagerNext({
                    collection: this.collection,
                    text: 'Next'
                }));
            }

            return this;
        },
        remove: function() {
            if (this.collection) {
                this.collection.off();
            }
        },
        addView: function(view) {
            this.itemViews.push(view);
            this.$el.append(view.render().el);
            return view;
        }
    }));

})(window.jQuery, window.Backbone, window._, window.Dime);
