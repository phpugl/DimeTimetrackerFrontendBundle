'use strict';

/**
 * Dime - core/views/filter.project.js
 */
(function ($, Backbone, _, moment, App) {

    // Create Filter view in App.Views.Core
    App.provide('Views.Core.Filter.Project', Backbone.View.extend({
        events: {},
        parent: undefined,
        options: {
            name: 'project',
            ui: '#filter-project',
            events:{
                'change #filter-project':'filterProject'
            }
        },
        initialize: function(config) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            if (config && config.options) {
                this.options = $.extend(true, {}, this.options, config.options);
            }

            if (this.options.events) {
                this.events = $.extend(true, {}, this.events, this.options.events);
            }

            this.projects = App.session.get('project-filter-collection', function () {
                return new App.Collection.Projects();
            });
        },
        render: function(parent) {
            this.parent = parent;

            // Render a project select list
            this.component = new App.Views.Core.Select({
                el:this.options.ui,
                collection:this.projects,
                options:{
                    blankText:'by project'
                }
            }).render();

            return this;
        },
        remove: function() {
            if (this.projects) {
                this.projects.off();
            }
        },
        updateUI: function(filter) {
            if (filter) {
                if (filter[this.options.name]) {
                    this.component.select(filter[this.options.name]);
                } else {
                    this.component.select('');
                }
            }
        },
        toggleFilter: function() {
            this.projects.fetch();
        },
        resetFilter:function (filter) {
            if (filter && filter[this.options.name]) {
                delete filter[this.options.name];
            }
        },
        filterProject:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.parent.options.name) || {},
                value = this.component.value();

            if (value && value.length > 0) {
                filter[this.options.name] = value;
            } else {
                delete filter[this.options.name];
            }

            App.session.set(this.parent.options.name, filter);
            this.parent.updateFilter();

            return this;
        }
    }));

})(jQuery, Backbone, _, moment, Dime);
