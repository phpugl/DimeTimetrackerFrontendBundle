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
            model: model,
            template:'DimeTimetrackerFrontendBundle:Settings:form',
            options: {
                backNavigation:'setting',
                prefix: 'setting-',
                ui: {
                    title: 'Add Setting',
                    titleElement: 'header.page-header h1'
                }
            }
        }));
    });
    App.router.route("setting/:id/edit", "setting:edit", function (id) {
        var model = new App.Model.Setting({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.setting');
        App.router.switchView(new App.Views.Setting.Form({
            model: model,
            template:'DimeTimetrackerFrontendBundle:Settings:form',
            options: {
                backNavigation:'setting',
                prefix: 'setting-',
                ui: {
                    title: 'Edit Setting',
                    titleElement: 'header.page-header h1'
                }
            }
        }));
    });

    // Setting view
    App.provide('Views.Setting.Index', App.Views.Core.Content.extend({
        events: {
            'click .filter-button': 'toggleFilter'
        },
        template:'DimeTimetrackerFrontendBundle:Settings:index',
        initialize:function () {
            this.settings = App.session.get('settings', function () {
                return new App.Collection.Settings();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter.Form({
                el: '#setting-filter',
                collection: this.settings,
                defaults: {
                    name: 'setting-filter',
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
        },
        toggleFilter: function(e) {
            if (e) {
                e.stopPropagation();
            }

            if (this.filter) {
                this.filter.toggleFilter(e);
            }

            return this;
        }
    }));

})(jQuery, Backbone, _, Dime);
