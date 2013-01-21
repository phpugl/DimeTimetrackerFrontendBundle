'use strict';

/**
 * Dime - core/views/filter.tags.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Tags', Backbone.View.extend({
        events: {},
        parent: undefined,
        defaults: {
            name: 'tags',
            ui: {
                with: '#filter-with-tags',
                without: '#filter-without-tags'
            },
            events:{
                'change #filter-with-tags':'filterWith',
                'change #filter-without-tags':'filterWithout'
            }
        },
        initialize: function(opt) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            if (opt && opt.defaults) {
                this.defaults = $.extend(true, {}, this.defaults, opt.defaults);
            }

            if (this.defaults.events) {
                this.events = $.extend(true, {}, this.events, this.defaults.events);
            }

            this.tags = App.session.get('tags-filter-collection', function () {
                return new App.Collection.Tags();
            });
        },
        render: function(parent) {
            this.parent = parent;

            // Render a tag select list
            if (this.defaults.ui.with) {
                this.withTagsFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.with,
                    collection:this.tags,
                    defaults:{
                        blankText:'with tag'
                    }
                }).render();
            }

            // Render a tag select list
            if (this.defaults.ui.without) {
                this.withoutTagsFilter = new App.Views.Core.Select({
                    el:this.defaults.ui.without,
                    collection:this.tags,
                    defaults:{
                        blankText:'without tag'
                    }
                }).render();
            }

            return this;
        },
        remove: function() {
            if (this.tags) {
                this.tags.off();
            }
        },
        updateUI: function(filter) {
            if (filter) {
                if (this.defaults.ui.with && this.withTagsFilter) {
                    if (filter.withTags) {
                        this.withTagsFilter.select(filter.withTags);
                    } else {
                        this.withTagsFilter.select('');
                    }
                }
                if (this.defaults.ui.without && this.withoutTagsFilter) {
                    if (filter.withoutTags) {
                        this.withoutTagsFilter.select(filter.withoutTags);
                    } else {
                        this.withoutTagsFilter.select('');
                    }
                }
            }
        },
        toggleFilter: function() {
            this.tags.fetch();
        },
        resetFilter:function (filter) {
            if (filter && filter.withTags) {
                delete filter.withTags;
            }
            if (filter && filter.withoutTags) {
                delete filter.withoutTags;
            }
        },
        filterWith:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                value = this.withTagsFilter.val();

            if (value && value.length > 0) {
                filter.withTags = value;
            } else {
                delete filter.withTags;
            }

            App.session.set(this.parent.defaults.name, filter);
            this.parent.updateFilter();

            return this;
        },
        filterWithout:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.parent.defaults.name) || {},
                value = this.withoutTagsFilter.value();

            if (value && value.length > 0) {
                filter.withoutTags = value;
            } else {
                delete filter.withoutTags;
            }

            App.session.set(this.parent.defaults.name, filter);
            this.parent.updateFilter();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
