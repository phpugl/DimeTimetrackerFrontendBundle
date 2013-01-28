'use strict';

/**
 * Dime - app/project/index.js
 */
(function ($, App) {

    // Add menu item to main menu
    App.menu.get('admin').submenu.add({
        id:"project",
        title:"Project",
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
            template:'DimeTimetrackerFrontendBundle:Projects:form',
            options: {
                backNavigation:'project',
                prefix: 'project-',
                ui: {
                    title: 'Add Project',
                    titleElement: 'header.page-header h1'
                }
            }
        }));
    });
    App.router.route("project/:id/edit", "project:edit", function (id) {
        var model = new App.Model.Project({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.project');
        App.router.switchView(new App.Views.Project.Form({
            model: model,
            template:'DimeTimetrackerFrontendBundle:Projects:form',
            options: {
                backNavigation:'project',
                prefix: 'project-',
                ui: {
                    title: 'Edit Project',
                    titleElement: 'header.page-header h1'
                }
            }
        }));
    });

    // Project view
    App.provide('Views.Project.Index', App.Views.Core.Content.extend({
        events: {
            'click .filter-button': 'toggleFilter'
        },
        template:'DimeTimetrackerFrontendBundle:Projects:index',
        initialize:function () {
            this.projects = App.session.get('projects', function () {
                return new App.Collection.Projects();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter.Form({
                el: '#project-filter',
                collection: this.projects,
                options: {
                    name: 'project-filter',
                    items: {
                        customer: new App.Views.Core.Filter.Customer(),
                        search: new App.Views.Core.Filter.Search()
                    }
                }
            }).render();

            // Render pager
            this.pager = new App.Views.Core.Pager({
                collection: this.projects
            });
            $('.pagination').html(this.pager.render().el);

            // Create project list
            this.list = new App.Views.Core.List({
                el:'#projects',
                collection:this.projects,
                options:{
                    fetch: false,
                    prefix:'project-',
                    emptyTemplate: '#tpl-project-empty',
                    item:{
                        attributes:{ "class":"project box box-folded" },
                        tagName:"section",
                        template:'#tpl-project-item',
                        View:App.Views.Project.Item
                    }
                }
            }).render();

            this.filter.updateFilter();

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

})(jQuery, Dime);
