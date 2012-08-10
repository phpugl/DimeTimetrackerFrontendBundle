'use strict';

/*
 * Dime - service list view
 */
(function ($, Backbone, _, App) {

    // Create option item view in App.Views.Core
    App.provide('Views.Core.SelectOption', Backbone.View.extend({
        tagName:"option",
        defaults:{
            name:'name',
            value:'id',
            blank:''
        },
        initialize:function (opt) {
            _.bindAll(this, 'render');

            if (opt && opt.defaults) {
                this.defaults = $.extend(true, {}, this.defaults, opt.defaults);
            }
        },
        render:function () {
            if (this.model) {
                this.$el
                    .attr('value', this.model.get(this.defaults.value))
                    .text(this.model.get(this.defaults.name));
            } else {
                this.$el
                    .attr('value', '')
                    .text(this.defaults.blank);
            }
            return this;
        }
    }));

    // Create select item view in App.Views.Core
    App.provide('Views.Core.Select', Backbone.View.extend({
        tagName:"select",
        defaults:{
            withBlank:true,
            blankText:'',
            selected:undefined,
            view:App.Views.Core.SelectOption
        },
        itemViews: [],
        initialize:function (opt) {
            _.bindAll(this, 'render', 'addBlank', 'addOne', 'addAll', 'select', 'fetch');

            if (this.collection) {
                this.collection.on('reset', this.addAll, this);
                this.collection.on('add', this.addOne, this);
                this.collection.on('change', this.change, this);
            }

            if (opt && opt.defaults) {
                // grep selected option can be service object or just the id
                if (opt.defaults.selected) {
                    opt.defaults.selected = (opt.defaults.selected.id) ? opt.defaults.selected.id : opt.defaults.selected;
                }

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
        render: function(opt) {
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
            } else if (opt && opt.fetch) {
                this.collection.fetch(opt.fetchData);
            }

            return this;
        },
        addBlank:function () {
            var view = new this.defaults.view({ defaults:{ blank:this.defaults.blankText }});
            this.itemViews.push(view);
            this.$el.append(view.render().el);
        },
        addOne:function (obj) {
            var view = new this.defaults.view({
                model:obj
            });
            this.itemViews.push(view);
            this.$el.append(view.render().el);
        },
        addAll:function () {
            // clear select
            for (var i=0; i<this.itemViews.length; i++) {
                this.itemViews[i].remove();
            }
            this.itemViews = [];
            this.$el.html('');

            if (this.defaults.withBlank) {
                this.addBlank();
            }

            if (this.collection) {
                this.collection.each(this.addOne);
            }

            // select option if selectedId exists
            if (this.defaults.selected) {
                this.$el.val(this.defaults.selected);
            }
        },
        fetch:function (opt) {
            if (this.collection) {
                this.collection.fetch(opt);
            }
            return this;
        },
        select:function (id) {
            this.defaults.selected = id;
            this.$el.val(id);

            return this;
        }

    }));

})(jQuery, Backbone, _, Dime);
