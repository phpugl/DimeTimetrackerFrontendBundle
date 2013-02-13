'use strict';

/**
 * Dime - app/setting/form.js
 */
(function ($, App) {

    App.provide('Views.Setting.Form', App.Views.Core.Content.extend({
        options: {},
        template:'DimeTimetrackerFrontendBundle:Settings:form',
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
                el: '#setting-form',
                model: this.model,
                options: {
                    backNavigation:'setting'
                }
            });
            this.form.render();

            return this;
        }
    }));

})(jQuery, Dime);
