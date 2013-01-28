'use strict';

/**
 * Dime - core/views/list.js
 */
(function ($, Backbone, _, App) {

    // Create list item view in App.Views.Core
    App.provide('Views.Core.ListItem', Backbone.View.extend({
        prefix:'',
        initialize:function (opt) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            // Grep default values from option
            if (opt && opt.prefix) {
                this.prefix = opt.prefix;
            }

            if (opt && opt.template) {
                this.template = opt.template;
            }
        },
        elId:function () {
            var id = this.$el.attr('id');
            return (id) ? id : this.prefix + this.model.get('id');
        },
        render:function () {
            // grep template with jquery and generate template stub
            var temp = App.template(this.template);

            // fill model date into template and push it into element html
            this.$el.html(temp({
                App: App,
                model:this.model,
                data:this.model.toJSON()
            }));

            // add element id with prefix
            this.$el.attr('id', this.elId);

            return this;
        },
        remove:function () {
            // remove element from DOM
            this.$el.empty().detach();
        }
    }));


    // provide list view in App.Views.Core
    App.provide('Views.Core.List', Backbone.View.extend({
        options:{
            fetch: false,
            emptyTemplate: false,
            prefix:'',
            item:{
                attributes:{},
                prepend:false,
                prependNew:false,
                tagName:'div',
                template:'',
                View:App.Views.Core.ListItem
            }
        },
        initialize:function (config) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this, 'render', 'remove', 'addAll', 'addItem', 'changeItem', 'removeItem');

            // Assign function to collection events
            if (this.collection) {
                this.collection.on('reset', this.addAll, this);
                this.collection.on('sort', this.addAll, this);
                this.collection.on('add', this.addItem, this);
                this.collection.on('change', this.changeItem, this);
                this.collection.on('remove', this.removeItem, this);
            }

            // Grep default values from option
            if (config && config.options) {
                this.options = $.extend(true, {}, this.options, config.options);
            }

            if (config && config.template) {
                this.template = config.template;

                if (config && config.templateEl) {
                    this.templateEl = config.templateEl;
                }
            }
        },
        render:function (fetchOpt) {
            // grep template with jquery and generate template stub
            if (this.template) {
                var temp = App.template(this.template);

                // fill model date into template and push it into element html
                this.$el.html(temp({
                    model:this.model,
                    data:this.model.toJSON()
                }));

                if (this.templateEl) {
                    this.setElement(this.templateEl);
                }
            }

            if (this.options.fetch) {
                this.collection.fetch(fetchOpt);
            } else if (this.collection) {
                this.addAll();
            }

            return this;
        },
        renderItem:function (model) {
            return new this.options.item.View({
                model:model,
                collection: this.collection,
                prefix:this.options.prefix,
                attributes:this.options.item.attributes,
                tagName:this.options.item.tagName,
                template:this.options.item.template
            }).render();
        },
        remove:function () {
            if (this.collection) {
                this.collection.off();
            }
            return this;
        },
        addAll: function () {
            var tEmpty = '';

            if (this.options.emptyTemplate) {
                tEmpty = App.template(this.options.emptyTemplate);
            }

            // remove all content
            this.$el.addClass('loading').html('');

            // run addItem on each collection item
            if (this.collection) {
                if (this.collection.length > 0) {
                    this.options.isEmpty = false;

                    this.collection.each(function(model) {
                        var $el = this.renderItem(model).$el;

                        if (!$el.is(':empty')) {
                            if (this.options.item.prepend) {
                                this.$el.prepend($el);
                            } else {
                                this.$el.append($el);
                            }
                        }
                    }, this);
                }
            }

            this.$el.removeClass('loading');

            if (this.options.emptyTemplate && this.$el.is(":empty")) {
                this.$el.html(tEmpty());
                this.options.isEmpty = true;
            }
            return this;
        },
        addItem:function (model) {
            if (this.options.isEmpty) {
                this.$el.html('');
                this.options.isEmpty = false;
            }

            if (this.options.item.prependNew) {
                this.$el.prepend(this.renderItem(model).el);
            } else {
                this.$el.append(this.renderItem(model).el);
            }

            return this;
        },
        changeItem:function (model) {
            if (model.id !== undefined) {
                var item = $('#' + this.options.prefix + model.id),
                    newItem = this.renderItem(model),
                    classes = item.attr('class');

                newItem.$el.addClass(classes);
                item.replaceWith(newItem.el);
            } else { // run addAll if item has no Id
                this.addAll();
            }
            return this;
        },
        removeItem:function(model) {
            if (model.id !== undefined) {
                $('#' + this.options.prefix + model.id).empty().detach();
                if (this.collection.length === 0) {
                    this.collection.reset();
                }
            }
            return this;
        }
    }));

})(window.jQuery, window.Backbone, window._, window.Dime);
