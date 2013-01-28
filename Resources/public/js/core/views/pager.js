'use strict';

/**
 * Dime - core/views/pager.js
 */
(function ($, Backbone, _, App) {

    /**
     * Dime.Views.Core.PagerItem
     *
     *
     */
    App.provide('Views.Core.PagerItem', Backbone.View.extend({
        tagName: 'li',
        events: {
            'click': 'update'
        },
        text: '',
        current: false,
        pager: undefined,
        initialize:function (opt) {
            _.bindAll(this, 'render', 'update');

            if (opt) {
                if (opt.text) {
                    this.text = opt.text;
                }

                this.current = (opt.current) ? true : false;

                if (opt.pager) {
                    this.pager = opt.pager;
                }
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
            this.pager.setPage(this.$el.data('page'));
        }
    }));

    App.provide('Views.Core.PagerNext', Backbone.View.extend({
        tagName: 'li',
        events: {
            'click': 'update'
        },
        text: '',
        pager: undefined,
        initialize:function (opt) {
            _.bindAll(this, 'render', 'update');
            if (opt) {
                if (opt.text) {
                    this.text = opt.text;
                }

                if (opt.pager) {
                    this.pager = opt.pager;
                }
            }
        },
        render:function () {
            this.$el.html('<a title="' + this.text + '"><i class="icon-chevron-right hide-text">' + this.text + '</i></a>');
            return this;
        },
        update:function() {
            this.pager.nextPage();
        }
    }));

    App.provide('Views.Core.PagerPrev', Backbone.View.extend({
        tagName: 'li',
        events: {
            'click': 'update'
        },
        text: '',
        pager: undefined,
        initialize:function (opt) {
            _.bindAll(this, 'render', 'update');
            if (opt) {
                if (opt.text) {
                    this.text = opt.text;
                }

                if (opt.pager) {
                    this.pager = opt.pager;
                }
            }
        },
        render:function (text) {
            this.$el.html('<a title="' + this.text + '"><i class="icon-chevron-left hide-text">' + this.text + '</i></a>');
            return this;
        },
        update:function() {
            this.pager.prevPage();
        }
    }));


    // provide list view in App.Views.Core
    App.provide('Views.Core.Pager', Backbone.View.extend({
        tagName: 'ul',
        itemViews: [],
        pager: {},
        initialize:function (opt) {
            _.bindAll(this, 'render', 'remove', 'addView');

            if (this.collection) {
                this.collection.on('reset', this.render, this);
                this.collection.on('sync', this.retrievePagerHeader, this);
            }
        },
        render:function () {
            // clear pager
            for (var i=0; i<this.itemViews.length; i++) {
                this.itemViews[i].remove();
            }
            this.itemViews = [];
            this.$el.html('');

            this.resetPager();
            var pager = this.getPager();
            if (pager.prev) {
                this.addView(new App.Views.Core.PagerPrev({
                    pager: this,
                    text: 'Prev'
                }));
            }

            if (pager.total > 1) {
                for (i=1; i<=pager.total; i++) {
                    this.addView(new App.Views.Core.PagerItem({
                        pager: this,
                        text: i,
                        current: (i==pager.current)
                    }));
                }
            }

            if (pager.next) {
                this.addView(new App.Views.Core.PagerNext({
                    pager: this,
                    text: 'Next'
                }));
            }
            this.collection.mergeFetchData(this.getPagerOptions());

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
        },
        retrievePagerHeader: function(collection, xhr, options) {
            if(options && options.hasOwnProperty('getResponseHeader')) {
                options = {
                    xhr: options
                };
            }
            if(options && options.xhr.getResponseHeader('X-Pagination-Total-Results')) {
                this.pager.total = options.xhr.getResponseHeader('X-Pagination-Total-Results');
            }
        },
        getPager: function() {
            return {
                current: this.pager.page,
                prev: (this.pager.page > 1),
                next: (this.pager.page < this.pageCount()),
                total: this.pageCount()
            };
        },
        resetPager:function () {
            this.pager = {
                count:20,
                page:1
            };
        },
        getPagerOptions:function () {
            var offset = (this.pager.page - 1) * this.pager.count;

            return { limit:this.pager.count, offset:offset };
        },
        pageCount:function () {
            return (this.pager.count > 0) ? Math.floor(this.pager.total / this.pager.count) : 0;
        },
        prevPage:function () {
            if (this.pager.page > 0) {
                this.pager.page -= 1;
            } else {
                this.pager.page = 1;
            }
            this.collection.mergeFetchData(this.getPagerOptions());
            this.collection.load();
        },
        setPage:function (num) {
            num = num || 1;
            if (num >= 1 && num <= this.pageCount()) {
                this.pager.page = num;
            } else {
                this.pager.page = 1;
            }
            this.collection.mergeFetchData(this.getPagerOptions());
            this.collection.load();
        },
        nextPage:function() {
            if (this.pager.page <= this.pageCount()) {
                this.pager.page += 1;
            } else {
                this.pager.page = this.pageCount();
            }
            this.collection.mergeFetchData(this.getPagerOptions());
            this.collection.load();
        }
    }));

})(window.jQuery, window.Backbone, window._, window.Dime);
