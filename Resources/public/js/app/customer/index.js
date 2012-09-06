'use strict';

/**
 * Dime - app/customer/index.js
 */
(function ($, App) {

    // Add menu item to main menu
    App.menu({
        name:"customer",
        title:"Customer",
        route:"customer",
        weight:0,
        callback:function () {
            App.UI.menu.activateItem('customer');
            App.UI.router.switchView(new App.Views.Customer.Index());
        }
    });

    // Define Routes
    App.route("customer:add", "customer/add", function () {
        var model = new App.Model.Customer();

        App.UI.menu.activateItem('customer');
        App.UI.router.switchView(new App.Views.Customer.Form({
            defaults:{
                title:'Add Customer',
                template:'DimeTimetrackerFrontendBundle:Customers:form',
                templateEl:'#customer-form',
                backNavigation:'customer'
            },
            model:model
        }));
    });
    App.route("customer:edit", "customer/:id/edit", function (id) {
        var model = new App.Model.Customer({id:id});
        model.fetch({async:false});

        App.UI.menu.activateItem('customer');
        App.UI.router.switchView(new App.Views.Customer.Form({
            defaults:{
                title:'Edit Customer',
                template:'DimeTimetrackerFrontendBundle:Customers:form',
                templateEl:'#customer-form',
                backNavigation:'customer'
            },
            model:model
        }));
    });

    // Customer view
    App.provide('Views.Customer.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Customers:index',
        initialize:function () {
            this.customers = App.session.get('customers', function () {
                return new App.Collection.Customers();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter({
                el: this.el,
                collection: this.customers,
                defaults: {
                    name: 'customer-filter',
                    preservedOnReset: {
                        open: true
                    },
                    ui: {
                        dates: false,
                        customers: false,
                        projects: false,
                        services: false
                    }
                }
            }).render();

            // Render pager
            this.pager = new App.Views.Core.Pager({
                collection: this.customers
            });
            $('.pagination').html(this.pager.render().el);


            // Render customer list
            this.list = new App.Views.Core.List({
                el:'#customers',
                collection:this.customers,
                defaults:{
                    fetch: false,
                    prefix:'customer-',
                    emptyTemplate: '#tpl-customer-empty',
                    item:{
                        attributes:{ "class":"customer" },
                        tagName:'section',
                        template:'#tpl-customer-item',
                        View:App.Views.Customer.Item
                    }
                }
            }).render();

            this.filter.updateFilter();

            return this;
        },
        remove:function () {
            // Unbind events
            this.customers.off();

            this.list.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        }
    }));

})(jQuery, Dime);
