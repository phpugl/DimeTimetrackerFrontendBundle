'use strict';

/**
 * Dime - app/customer/index.js
 */
(function ($, App) {

    // Add menu item to main menu
    App.menu.get('admin').submenu.add({
        id:"customer",
        title:"Customer",
        route:"customer",
        weight:0,
        callback:function () {
            App.menu.activateItem('admin.customer');
            App.router.switchView(new App.Views.Customer.Index());
        }
    });

    // Define Routes
    App.router.route("customer/add", "customer:add", function () {
        var model = new App.Model.Customer();

        App.menu.activateItem('admin.customer');
        App.router.switchView(new App.Views.Customer.Form({
            model: model,
            template:'DimeTimetrackerFrontendBundle:Customers:form',
            options: {
                backNavigation:'customer',
                prefix: 'customer-',
                ui: {
                    title: 'Add Customer',
                    titleElement: 'header.page-header h1'
                }
            }
        }));
    });
    App.router.route("customer/:id/edit", "customer:edit", function (id) {
        var model = new App.Model.Customer({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.customer');
        App.router.switchView(new App.Views.Customer.Form({
            model: model,
            template:'DimeTimetrackerFrontendBundle:Customers:form',
            options: {
                backNavigation:'customer',
                prefix: 'customer-',
                ui: {
                    title: 'Edit Customer',
                    titleElement: 'header.page-header h1'
                }
            }
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
            this.filter = new App.Views.Core.Filter.Form({
                el: this.el,
                collection: this.customers,
                defaults: {
                    name: 'customer-filter',
                    items: {
                        search: new App.Views.Core.Filter.Search()
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
                        attributes:{ "class":"customer box" },
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
