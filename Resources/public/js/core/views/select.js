'use strict';

/*
 * Dime - service list view
 */
(function ($, Backbone, _, App) {

    // Create option item view in App.Views.Core
    App.provide('Views.Core.SelectOption', Backbone.View.extend({
        tagName:"option",
        options:{
            name:'name',
            value:'id',
            blank:''
        },
        initialize:function (config) {
            _.bindAll(this, 'render');

            if (config && config.options) {
                this.options = $.extend(true, {}, this.options, config.options);
            }
        },
        render:function () {
            if (this.model) {
                this.$el
                    .attr('value', this.model.get(this.options.value))
                    .text(this.model.get(this.options.name));
            } else {
                this.$el
                    .attr('value', '')
                    .text(this.options.blank);
            }
            return this;
        }
    }));

    // Create select item view in App.Views.Core
    App.provide('Views.Core.Select', Backbone.View.extend({
        tagName:"select",
        options:{
            withBlank:true,
            blankText:'',
            selected:undefined,
            itemView: App.Views.Core.SelectOption,
            itemSettings: {}
        },
        items: [],
        initialize:function (config) {
            _.bindAll(this, 'render', 'addBlank', 'addOne', 'addAll', 'select', 'fetch');

            if (this.collection) {
                this.collection.on('reset', this.addAll, this);
                this.collection.on('add', this.addOne, this);
                this.collection.on('change', this.change, this);
            }

            if (config && config.options) {
                // grep selected option can be service object or just the id
                if (config.options.selected) {
                    config.options.selected = (config.options.selected.id) ? config.options.selected.id : config.options.selected;
                }

                this.options = $.extend(true, {}, this.options, config.options);
            }

            if (config && config.template) {
                this.template = config.template;

                if (config && config.templateEl) {
                    this.templateEl = config.templateEl;
                } else {
                    throw "You have to setup a templateEl option together with template.";
                }
            }
        },
        render: function(opt) {
            // grep template with jquery and generate template stub
            if (this.template) {
                var temp = App.template(this.template);

                // fill model date into template and push it into element html
                this.$el.html(temp({
                    model:this.model,
                    data:this.model.toJSON()
                }));

                this.setElement(this.templateEl);
            }

            if (this.collection && this.collection.length > 0) {
                this.addAll();
            } else if (opt && opt.fetch) {
                this.collection.fetch(opt.fetchData);
            }

            return this;
        },
        addBlank:function () {
            var view = new this.options.itemView({ options:{ blank:this.options.blankText }});
            this.items.push(view);
            this.$el.append(view.render().el);
        },
        addOne:function (obj) {
            var view = new this.options.itemView({
                model:obj,
                options: this.options.itemSettings
            });
            this.items.push(view);
            this.$el.append(view.render().el);
        },
        addAll:function () {
            // clear select
            for (var i=0; i<this.items.length; i++) {
                this.items[i].remove();
            }
            this.items = [];
            this.$el.html('');

            if (this.options.withBlank) {
                this.addBlank();
            }

            if (this.collection) {
                this.collection.each(this.addOne);
            }

            // select option if selectedId exists
            if (this.options.selected) {
                this.$el.val(this.options.selected);
            }
        },
        fetch:function (opt) {
            if (this.collection) {
                this.collection.fetch(opt);
            }
            return this;
        },
        select:function (id) {
            this.options.selected = id;
            this.$el.val(id);

            return this;
        },
        value: function() {
            return this.$el.val();
        }
    }));

})(jQuery, Backbone, _, Dime);
