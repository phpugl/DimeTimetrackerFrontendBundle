'use strict';

/**
 * Dime - app/project/index.js
 */
(function ($, App) {

    // Add menu item to main menu
    App.menu.get('admin').submenu.add({
        id:"project",
        title:"Projects",
        route:"project",
        weight:0,
        callback:function () {
            App.menu.activateItem('admin.project');
            App.router.switchView(new App.Views.Project.Index());
        }
    });

    // Define Routes
    App.router.route("project/add", "project:add", function () {
        var model = new App.Model.Project();

        App.menu.activateItem('admin.project');
        App.router.switchView(new App.Views.Project.Form({
            model: model,
            options: {
                title: 'Add project'
            }
        }));
    });
    App.router.route("project/:id/edit", "project:edit", function (id) {
        var model = new App.Model.Project({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.project');
        App.router.switchView(new App.Views.Project.Form({
            model: model,
            options: {
                title: 'Edit project'
            }
        }));
    });

    // Project view
    App.provide('Views.Project.Index', App.Views.Core.Content.extend({
        events: {
            'click .toggle-options': 'toggleOptions'
        },
        template:'DimeTimetrackerFrontendBundle:Projects:index',
        initialize:function () {
            this.projects = App.session.get('projects', function () {
                return new App.Collection.Projects();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Form.Filter({
                el: '#project-filter',
                collection: this.projects,
                options: {
                    name: 'project-filter',
                    widgets: {
                        customer: new App.Views.Core.Widget.Select({
                            el: '#filter-customer',
                            collection: App.session.get('customer-filter-collection', function () {
                                return new App.Collection.Customers();
                            }),
                            options: {
                                blankText: 'by customer'
                            }
                        })
                    }
                }
            }).render();

            // Render pager
            this.pager = new App.Views.Core.Pager({
                el: '.pagination',
                collection: this.projects,
                count: 25
            });

            // Create project list
            this.list = new App.Views.Core.List({
                el:'#projects',
                collection:this.projects,
                options:{
                    fetch: false,
                    prefix:'project-',
                    emptyTemplate: '#tpl-project-empty',
                    groupBy: {
                        key: 'customer.name',
                        template: '#tpl-project-header',
                        'undefined': 'No customer'
                    },
                    item:{
                        attributes:{ "class":"project box box-folded" },
                        tagName:"section",
                        template:'#tpl-project-item',
                        View:App.Views.Project.Item
                    }
                }
            }).render();

            this.filter.submit();

            return this;
        },
        remove:function () {
            // Unbind events
            this.projects.off();

            this.list.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        },
        toggleOptions: function(e) {
            if (e) {
                e.stopPropagation();
            }

            this.$('#project-filter').toggle();

            return this;
        }
    }));

})(jQuery, Dime);
