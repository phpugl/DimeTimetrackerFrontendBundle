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
        events:{
            'click #filter-button':'toggleFilter',
            'click #filter-reset':'resetFilter',
            'change #filter-customer':'filterCustomer'
        },
        initialize:function () {
            this.projects = App.session('projects');
            if (!this.projects) {
                this.projects = App.session('projects', new App.Collection.Projects());
            }
        },
        render:function () {
            this.projectList = new App.Views.Core.List({
                el:'#projects',
                collection:this.projects,
                defaults:{
                    prefix:'project-',
                    item:{
                        attributes:{ "class":"project" },
                        tagName:"section",
                        template:'#tpl-project-item',
                        View:App.Views.Project.Item
                    }
                }
            }).render();

            var filter = App.session('project-filter');
            this.projects.fetch({data:{ filter:filter } });

            var customers = App.session('customers');
            if (!customers) {
                customers = App.session('customers', new App.Collection.Customers());
            }
            this.customerFilter = new App.Views.Core.Select({
                el:'.filter-customer',
                collection:customers,
                defaults:{
                    selected:(filter && filter['customer']) ? filter['customer'] : undefined,
                    blankText:'Filter by Customer'
                }
            });
            this.customerFilter.refetch();

            if (!$.isEmptyObject(filter)) {
                $('#filter').show();
            }
        },
        toggleFilter:function (e) {
            e.preventDefault();
            $('#filter').toggle();
        },
        resetFilter:function (e) {
            e.preventDefault();
            var filter = App.session('project-filter', {});
            this.customerFilter.select('')
            $('#filter').toggle();
            this.projects.fetch({data:{ filter:filter } });
        },
        filterCustomer:function (e) {
            e.preventDefault();
            var filter = App.session('project-filter') || {},
                value = $('#filter-customer').val();

            if (value && value.length > 0) {
                filter['customer'] = $('#filter-customer').val();
            } else {
                delete filter.customer;
            }

            App.session('project-filter', filter);
            this.projects.fetch({data:{ filter: filter } });
        }
    }));

})(jQuery, Dime);