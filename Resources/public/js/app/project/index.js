'use strict';

/**
 * Dime - app/project/index.js
 */
(function ($, App) {

    // Add menu item to main menu
    App.menu({
        name:"project",
        title:"Project",
        route:"project",
        weight:0,
        callback:function () {
            App.UI.menu.activateItem('project');
            App.UI.router.switchView(new App.Views.Project.Index());
        }
    });

    // Define Routes
    App.route("project:add", "project/add", function () {
        var model = new App.Model.Project();

        App.UI.menu.activateItem('project');
        App.UI.router.switchView(new App.Views.Project.Form({
            defaults:{
                title:'Add Project',
                template:'DimeTimetrackerFrontendBundle:Projects:form',
                templateEl:'#project-form',
                backNavigation:'project'
            },
            model:model
        }));
    });
    App.route("project:edit", "project/:id/edit", function (id) {
        var model = new App.Model.Project({id:id});
        model.fetch({async:false});

        App.UI.menu.activateItem('project');
        App.UI.router.switchView(new App.Views.Project.Form({
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
            this.filter = new App.Views.Core.Filter({
                el: this.el,
                collection: this.projects,
                defaults: {
                    name: 'project-filter',
                    ui: {
                        dates: false,
                        projects: false,
                        services: false
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
                        attributes:{ "class":"project" },
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