'use strict';

/*
 * Dime - core/view/form.js
 */
(function ($, App) {

    App.provide('Views.Core.Form', App.Views.Core.Content.extend({
        defaults:{
            backNavigation:'',
            events:{
                'submit form':'save',
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close'
            }
        },
        initialize:function (opt) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            if (opt && opt.defaults) {
                this.defaults = $.extend(true, {}, this.defaults, opt.defaults);
            }

            if (this.defaults.events) {
                this.events = this.defaults.events;
            }

            if (this.defaults.template) {
                this.template = this.defaults.template;
            }
        },
        render:function () {
            this.setElement(this.defaults.templateEl, true);

            // Set title
            if (this.defaults.title) {
                $('header.page-header h1', this.$el).text(this.defaults.title);
            }

            // Fill form
            this.form = this.$el.form();
            this.form.clear();
            this.form.fill(this.model.toJSON());

            return this;
        },
        save:function (e) {
            e.preventDefault();
            var that = this;

            this.model.save(this.form.data(), {
                wait:true,
                success:function () {
                    that.close();
                },
                error:function (model, response, scope) {
                    var data = $.parseJSON(response.responseText);

                    if (data.errors) {
                        that.form.errors(data.errors);
                    }
                }
            });
        },
        close:function () {
            App.UI.router.navigate(this.defaults.backNavigation, { trigger:true });
        }
    }));


})(jQuery, Dime);