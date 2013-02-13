'use strict';

/**
 * Dime - app/service/form.js
 */
(function ($, App) {

    App.provide('Views.Service.Form',App.Views.Core.Content.extend({
        options: {},
        template:'DimeTimetrackerFrontendBundle:Services:form',
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
                el: '#service-form',
                model: this.model,
                options: {
                    backNavigation:'service',
                    widgets: {
                        alias: new App.Views.Core.Widget.Alias({
                            el: '#service-alias'
                        }),
                        tags: new App.Views.Core.Widget.Tags({
                            el: '#service-tags'
                        })
                    }
                }
            });
            this.form.render();

            return this;
        }
    }));

})(jQuery, Dime);
