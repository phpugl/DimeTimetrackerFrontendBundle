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
            defaults:{
                title:'Add Project',
                template:'DimeTimetrackerFrontendBundle:Projects:form',
                templateEl:'#project-form',
                backNavigation:'project'
            },
            model:model
        }));
    });
    App.router.route("project/:id/edit", "project:edit", function (id) {
        var model = new App.Model.Project({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.project');
        App.router.switchView(new App.Views.Project.Form({
            defaults:{
                title:'Edit Project',
                template:'DimeTimetrackerFrontendBundle:Projects:form',
                templateEl:'#project-form',
                backNavigation:'project'
            },
            model:model
        }));
    });

    // Project view
    App.provide('Views.Project.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Projects:index',
        initialize:function () {
            this.projects = App.session.get('projects', function () {
                return new App.Collection.Projects();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter.Form({
                el: this.el,
                collection: this.projects,
                defaults: {
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
                defaults:{
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
        }
    }));

})(jQuery, Dime);
