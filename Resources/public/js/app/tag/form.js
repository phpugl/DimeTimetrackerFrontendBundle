'use strict';

/**
 * Dime - app/tag/form.js
 */
(function ($, App) {

    App.provide('Views.Tag.Form', App.Views.Core.Form.Model.extend({
        options: {},
        template:'DimeTimetrackerFrontendBundle:Tags:form',
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
                el: '#tag-form',
                model: this.model,
                options: {
                    backNavigation:'tag'
                }
            });
            this.form.render();

            return this;
        }
    }));

})(jQuery, Dime);
