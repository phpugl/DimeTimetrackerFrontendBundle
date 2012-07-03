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
            var temp = _.template($(this.template).html());

            // fill model date into template and push it into element html
            this.$el.html(temp({
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
        defaults:{
            fetch: false,
            emptyTemplate: false,
            prefix:'',
            item:{
                attributes:{},
                prepend:false,
                tagName:'div',
                template:'',
                View:App.Views.Core.ListItem
            }
        },
        initialize:function (opt) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this, 'render', 'remove', 'addAll', 'addOne', 'change');

            // Assign function to collection events
            if (this.collection) {
                this.collection.on('reset', this.addAll, this);
                this.collection.on('add', this.addOne, this);
                this.collection.on('change', this.change, this);
            }

            // Grep default values from option
            if (opt && opt.defaults) {
                this.defaults = $.extend(true, {}, this.defaults, opt.defaults);
            }

            if (opt && opt.template) {
                this.template = opt.template;

                if (opt && opt.templateEl) {
                    this.templateEl = opt.templateEl;
                } else {
                    throw "You have to setup a templateEl option together with template.";
                }
            }
        },
        render:function (fetchOpt) {
            // grep template with jquery and generate template stub
            if (this.template) {
                var temp = _.template($(this.template).html());

                // fill model date into template and push it into element html
                this.$el.html(temp({
                    model:this.model,
                    data:this.model.toJSON()
                }));

                this.setElement(this.templateEl);
            }

            if (this.collection && this.collection.length > 0) {
                this.addAll();
            } else if (this.defaults.fetch) {
                this.collection.fetch(fetchOpt);
            }

            return this;
        },
        remove:function () {
            if (this.collection) {
                this.collection.off();
            }
            return this;
        },
        addAll:function () {
            // remove all content
            this.$el.html('').addClass('loading');

            // run addOne on each collection item
            if (this.collection) {
                if (this.collection.length == 0 && this.defaults.emptyTemplate) {
                    var temp = _.template($(this.defaults.emptyTemplate).html());
                    this.$el.html(temp());
                    this.defaults.isEmpty = true;
                } else {
                    this.collection.each(this.addOne);
                }
            } else {
                if (this.defaults.emptyTemplate) {
                    var temp = _.template($(this.defaults.emptyTemplate).html());
                    this.$el.html(temp());
                }
            }
            this.$el.removeClass('loading');

            return this;
        },
        addOne:function (model) {
            if (this.defaults.isEmpty) {
                this.$el.html('');
                this.defaults.isEmpty = false;
            }

            var item = new this.defaults.item.View({
                model:model,
                prefix:this.defaults.prefix,
                attributes:this.defaults.item.attributes,
                tagName:this.defaults.item.tagName,
                template:this.defaults.item.template
            }).render().el;


            if (this.defaults.item.prepend) {
                this.$el.prepend(item);
            } else {
                this.$el.append(item);
            }

            return this;
        },
        change:function (model) {
            if (model.id != undefined) {
                $('#' + this.defaults.prefix + model.id).replaceWith(new this.defaults.item.View({
                    model:model,
                    prefix:this.defaults.prefix,
                    attributes:this.defaults.item.attributes,
                    tagName:this.defaults.item.tagName,
                    template:this.defaults.item.template
                }).render().el
                );
            } else { // run addAll if item has no Id
                this.addAll();
            }
            return this;
        }
    }));

})(window.jQuery, window.Backbone, window._, window.Dime);
