'use strict';

/**
 * Dime - core/views/filter.js
 */
(function ($, Backbone, _, App) {

    App.provide('Views.Core.Filter.Form', Backbone.View.extend({
        events:{
            'click .filter-toggle':'toggleFilter',
            'click .filter-save':'saveFilter',
            'click .filter-reset':'resetFilter'
        },
        options: {
            name: 'filter',
            rendered: false,
            ignoreOnSave: {
                open: true
            },
            items: {}
        },
        initialize: function(config) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            if (config) {
                if (config.template) {
                    this.template = config.template;
                }

                if (config.options) {
                    this.options = $.extend(true, {}, this.options, config.options);
                }
            }

            if (this.options.events) {
                this.events = $.extend(true, {}, this.events, this.options.events);
            }
        },
        render: function() {
            // Load template
            if (this.template) {
                var temp = App.template(this.template);
                this.$el.html(temp);
            }

            // Render ui items
            for(var name in this.options.items) {
                if (this.options.items.hasOwnProperty(name)) {
                    var item = this.options.items[name].render(this);
                    item.setElement(this.el);
                }
            }

            // Load settings to session
            var settings = {};
            if (App.session.has('settings')) {
                settings = App.session.get('settings').values(this.options.name);
            }
            App.session.set(this.options.name, settings);

            return this;
        },
        updateFilter: function(settings) {
            var filter = settings || App.session.get(this.options.name);

            if (filter) {
                for(var name in this.options.items) {
                    if (this.options.items.hasOwnProperty(name)) {
                        this.options.items[name].updateUI(filter);
                    }
                }

                // Open filter
                if (filter.open) {
                    this.$el.show();
                } else {
                    this.$el.hide();
                }
            }

            if (this.collection) {
                this.collection.setFetchData('filter', filter);
                this.collection.load();
            }
        },
        toggleFilter: function(e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.options.name) || {};

            filter.open = (filter.open) ? false : true;
            this.$el.toggle(filter.open);

            if (filter.open && !this.options.rendered) {
                for(var name in this.options.items) {
                    if (this.options.items.hasOwnProperty(name)) {
                        this.options.items[name].toggleFilter();
                    }
                }
                this.options.rendered = true;
            }
            App.session.set(this.options.name, filter);
        },
        saveFilter: function(e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.options.name) || {},
                settings = App.session.get('settings');

            if (settings) {
                var models = settings.where({ namespace: this.options.name });

                // Update and delete
                for (var i=0; i<models.length; i++) {
                    var model = models[i];
                    if (filter[model.get('name')]) {
                        model.save({ value: JSON.stringify(filter[model.get('name')]) });
                    } else {
                        model.destroy();
                    }
                }

                // Insert new
                for (var name in filter) {
                    if (filter.hasOwnProperty(name)
                        && !this.options.ignoreOnSave[name]
                        && !settings.hasSetting(this.options.name, name)) {
                        settings.create({
                            namespace: this.options.name,
                            name: name,
                            value: JSON.stringify(filter[name])
                        });
                    }
                }
                App.notify("Filter settings has been saved.", "success")
            }

            return this;
        },
        resetFilter: function(e) {
            if (e) {
                e.preventDefault();
            }

            var settings = {};
            if (App.session.has('settings')) {
                settings = App.session.get('settings').values(this.options.name);
            }
            this.updateFilter(settings);

            return this;
        }

    }));

})(jQuery, Backbone, _, Dime);
