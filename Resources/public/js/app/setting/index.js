'use strict';

/**
 * Dime - app/setting/index.js
 */
(function ($, Backbone, _, App) {

    // Add menu item to main menu
    App.menu.get('admin').submenu.add({
        id:"setting",
        title:"Settings",
        route:"setting",
        weight:0,
        callback:function () {
            App.menu.activateItem('admin.setting');
            App.router.switchView(new App.Views.Setting.Index());
        }
    });

    // Define Routes
    App.router.route("setting/add", "setting:add", function () {
        var model = new App.Model.Setting();

        App.menu.activateItem('admin.setting');
        App.router.switchView(new App.Views.Setting.Form({
            defaults:{
                title:'Add Setting',
                template:'DimeTimetrackerFrontendBundle:Settings:form',
                templateEl:'#setting-form',
                backNavigation:'setting'
            },
            model:model
        }));
    });
    App.router.route("setting/:id/edit", "setting:edit", function (id) {
        var model = new App.Model.Setting({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.setting');
        App.router.switchView(new App.Views.Setting.Form({
            defaults:{
                title:'Edit Setting',
                template:'DimeTimetrackerFrontendBundle:Settings:form',
                templateEl:'#setting-form',
                backNavigation:'setting'
            },
            model:model
        }));
    });

    // Setting view
    App.provide('Views.Setting.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Settings:index',
        initialize:function () {
            this.settings = App.session.get('settings', function () {
                return new App.Collection.Settings();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter.Form({
                el: this.el,
                collection: this.settings,
                defaults: {
                    name: 'setting-filter',
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
                collection: this.settings
            });
            $('.pagination').html(this.pager.render().el);


            // Render setting list
            this.list = new App.Views.Core.List({
                el:'#settings',
                collection:this.settings,
                defaults:{
                    fetch: false,
                    prefix:'setting-',
                    emptyTemplate: '#tpl-setting-empty',
                    item:{
                        tagName:"tr",
                        template:'#tpl-setting-item',
                        View:App.Views.Setting.Item
                    }
                }
            }).render();

            this.filter.updateFilter();

            return this;
        },
        remove:function () {
            // Unbind events
            this.settings.off();

            this.list.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        }
    }));

})(jQuery, Backbone, _, Dime);
