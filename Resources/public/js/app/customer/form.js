'use strict';

/**
 * Dime - app/customer/form.js
 */
(function ($, App) {

    App.provide('Views.Customer.Form', App.Views.Core.Content.extend({
        options: {},
        template:'DimeTimetrackerFrontendBundle:Customers:form',
        initialize: function(config) {
            if (config) {
                if (config.options) {
                    this.options = $.extend(true, {}, this.options, config.options);
                }
            }
        },
        render: function() {
            if (this.options.title) {
                this.$('header.page-header h1').text(this.options.title)
            }

            this.form = new App.Views.Core.Form.Model({
                el: '#customer-form',
                model: this.model,
                options: {
                    backNavigation:'customer',
                    widgets: {
                        alias: new App.Views.Core.Widget.Alias({
                            el: '#customer-alias'
                        }),
                        tags: new App.Views.Core.Widget.Tags({
                            el: '#customer-tags'
                        })
                    }
                }
            });
            this.form.render();

            return this;
        }
    }));

})(jQuery, Dime);
