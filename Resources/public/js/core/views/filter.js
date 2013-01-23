'use strict';

/**
 * Dime - core/views/filter.js
 */
(function ($, Backbone, _, moment, App) {

    App.provide('Views.Core.Filter.Form', Backbone.View.extend({
        events:{},
        defaults: {
            ui: '#filter',
            name: 'filter',
            rendered: false,
            ignore: {
                open: true
            },
            events:{
                'click #filter-button':'toggleFilter',
                'click #filter-save':'saveFilter',
                'click #filter-reset':'resetFilter'
            },
            items: {}
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

            this.component = $(this.defaults.ui);
        },
        render: function() {
            // render ui items
            if (this.defaults.ui) {
                for(var name in this.defaults.items) {
                    if (this.defaults.items.hasOwnProperty(name)) {
                        var item = this.defaults.items[name].render(this);
                        item.setElement(this.el);
                    }
                }

                // Load settings to session
                this.loadSettings();
            }
            return this;
        },
        loadSettings: function() {
            var settings = {};

            if (App.session.has('settings')) {
                settings = App.session.get('settings').values(this.defaults.name);
            }

            App.session.set(this.defaults.name, settings);
        },
        updateFilter: function(defaults) {
            var filter = App.session.get(this.defaults.name) || defaults;

            if (filter) {
                for(var name in this.defaults.items) {
                    if (this.defaults.items.hasOwnProperty(name)) {
                        this.defaults.items[name].updateUI(filter);
                    }
                }

                // Open filter
                if (filter.open) {
                    this.component.show();
                } else {
                    this.component.hide();
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

            var filter = App.session.get(this.defaults.name) || {};

            filter.open = (filter.open) ? false : true;
            this.component.toggle(filter.open);

            if (filter.open && !this.defaults.rendered) {
                for(var name in this.defaults.items) {
                    if (this.defaults.items.hasOwnProperty(name)) {
                        this.defaults.items[name].toggleFilter();
                    }
                }
                this.defaults.rendered = true;
            }
            App.session.set(this.defaults.name, filter);

            return this;
        },
        saveFilter: function(e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get(this.defaults.name) || {},
                settings = App.session.get('settings');

            if (settings) {
                var models = settings.where({ namespace: this.defaults.name });

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
                        && !this.ignore[name]
                        && !settings.hasSetting(this.defaults.name, name)) {
                        settings.create({
                            namespace: this.defaults.name,
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

            this.loadSettings();
            this.updateFilter();

            return this;
        }

    }));
})(jQuery, Backbone, _, moment, Dime);
