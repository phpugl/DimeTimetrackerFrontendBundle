'use strict';

/**
 * Dime - app/tag/index.js
 */
(function ($, App) {

    // Add menu item to main menu
    App.menu.get('admin').submenu.add({
        id:"tag",
        title:"Tag",
        route:"tag",
        weight:0,
        callback:function () {
            App.menu.activateItem('admin.tag');
            App.router.switchView(new App.Views.Tag.Index());
        }
    });

    // Define Routes
    App.router.route("tag/add", "tag:add", function () {
        var model = new App.Model.Tag();

        App.menu.activateItem('admin.tag');
        App.router.switchView(new App.Views.Tag.Form({
            defaults:{
                title:'Add Tag',
                template:'DimeTimetrackerFrontendBundle:Tags:form',
                templateEl:'#tag-form',
                backNavigation:'tag'
            },
            model:model
        }));
    });
    App.router.route("tag/:id/edit", "tag:edit", function (id) {
        var model = new App.Model.Tag({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.tag');
        App.router.switchView(new App.Views.Tag.Form({
            defaults:{
                title:'Edit Tag',
                template:'DimeTimetrackerFrontendBundle:Tags:form',
                templateEl:'#tag-form',
                backNavigation:'tag'
            },
            model:model
        }));
    });

    // Tag view
    App.provide('Views.Tag.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Tags:index',
        initialize:function () {
            this.tags = App.session.get('tags', function () {
                return new App.Collection.Tags();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter.Form({
                el: this.el,
                collection: this.tags,
                defaults: {
                    name: 'tag-filter',
                    preservedOnReset: {
                        open: true
                    },
                    items: {
                        search: new App.Views.Core.Filter.Search()
                    }
                }
            }).render();

            // Render pager
            this.pager = new App.Views.Core.Pager({
                collection: this.tags
            });
            $('.pagination').html(this.pager.render().el);


            // Render tag list
            this.list = new App.Views.Core.List({
                el:'#tags',
                collection:this.tags,
                defaults:{
                    fetch: false,
                    prefix:'tag-',
                    emptyTemplate: '#tpl-tag-empty',
                    item:{
                        attributes:{ "class":"tag box" },
                        tagName:'section',
                        template:'#tpl-tag-item',
                        View:App.Views.Tag.Item
                    }
                }
            }).render();

            this.filter.updateFilter();

            return this;
        },
        remove:function () {
            // Unbind events
            this.tags.off();

            this.list.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        }
    }));

})(jQuery, Dime);
