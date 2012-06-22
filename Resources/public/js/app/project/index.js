"use strict";
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
            this.projects = App.session.get('projects', function () {
                return new App.Collection.Projects();
            });

            this.customers = App.session.get('customers', function () {
                return new App.Collection.Customers();
            });
        },
        render:function () {
            var filter = App.session.get('project-filter');

            // Add customer list for filter customers
            this.customerFilter = new App.Views.Core.Select({
                el:'.filter-customer',
                collection:this.customers,
                defaults:{
                    selected:(filter && filter['customer']) ? filter['customer'] : undefined,
                    blankText:'Filter by Customer'
                }
            });
            this.customerFilter.refetch();

            // Create project list
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

            this.updateFilter();

            return this;
        },
        toggleFilter:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get('project-filter') || {};

            filter['open'] = (filter.open) ? false : true;
            $('#filter').toggle(filter.open);

            App.session.set('project-filter', filter);

            return this;
        },
        updateFilter:function () {
            var filter = App.session.get('project-filter');
            if (filter) {
                var data = {};

                // Display customer
                if (filter.customer) {
                    this.customerFilter.select(filter.customer);
                    data['customer'] = filter.customer;
                } else {
                    this.customerFilter.select('');
                }
                // Fetch filtered project data
                this.projects.fetch({ data:{ filter:data } });

                if (filter.open) {
                    $('#filter').show();
                }
            } else {
                // Fetch project data
                this.projects.fetch();
            }
            return this;
        },
        resetFilter:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get('project-filter') || {};

            if (filter.customer) {
                delete filter.customer;
            }

            App.session.set('project-filter', filter);

            this.updateFilter();
            this.toggleFilter();

            return this;
        },
        filterCustomer:function (e) {
            if (e) {
                e.preventDefault();
            }

            var filter = App.session.get('project-filter') || {},
                value = $('#filter-customer').val();

            if (value && value.length > 0) {
                filter['customer'] = value;
            } else {
                delete filter.customer;
            }

            App.session.set('project-filter', filter);
            this.updateFilter();

            return this;
        }
    }));

})(jQuery, Dime);