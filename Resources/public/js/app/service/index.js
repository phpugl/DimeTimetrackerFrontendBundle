'use strict';

/**
 * Dime - app/service/index.js
 */
(function ($, Backbone, _, App) {

    // Add menu item to main menu
    App.menu({
        name:"service",
        title:"Service",
        route:"service",
        weight:0,
        callback:function () {
            App.UI.menu.activateItem('service');
            App.UI.router.switchView(new App.Views.Service.Index());
        }
    });

    // Define Routes
    App.route("service:add", "service/add", function () {
        var model = new App.Model.Service();

        App.UI.menu.activateItem('service');
        App.UI.router.switchView(new App.Views.Service.Form({
            defaults:{
                title:'Add Service',
                template:'DimeTimetrackerFrontendBundle:Services:form',
                templateEl:'#service-form',
                backNavigation:'service'
            },
            model:model
        }));
    });
    App.route("service:edit", "service/:id/edit", function (id) {
        var model = new App.Model.Service({id:id});
        model.fetch({async:false});

        App.UI.menu.activateItem('service');
        App.UI.router.switchView(new App.Views.Service.Form({
            defaults:{
                title:'Edit Service',
                template:'DimeTimetrackerFrontendBundle:Services:form',
                templateEl:'#service-form',
                backNavigation:'service'
            },
            model:model
        }));
    });

    // Service view
    App.provide('Views.Service.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Services:index',
        initialize:function () {
            this.services = App.session.get('services', function () {
                return new App.Collection.Services();
            });
        },
        render:function () {
            this.filter = new App.Views.Core.Filter({
                el: this.el,
                collection: this.services,
                defaults: {
                    name: 'service-filter',
                    ui: {
                        dates: false,
                        customers: false,
                        projects: false,
                        services: false
                    }
                }
            }).render();

            this.serviceList = new App.Views.Core.List({
                el:'#services',
                collection:this.services,
                defaults:{
                    fetch: false,
                    prefix:'service-',
                    item:{
                        attributes:{ "class":"service" },
                        tagName:"section",
                        template:'#tpl-service-item',
                        View:App.Views.Service.Item
                    }
                }
            }).render();

            this.filter.updateFilter();

            return this;
        }
    }));

})(jQuery, Backbone, _, Dime);