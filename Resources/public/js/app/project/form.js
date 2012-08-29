'use strict';

/**
 * Dime - app/project/form.js
 */
(function ($, App) {

    App.provide('Views.Project.Form', App.Views.Core.Form.extend({
        defaults: {
            events:{
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close',
                'click .slugify':'slugify',
                'keypress #project-alias':'alias'
            }
        },
        render:function () {
            this.setElement(this.defaults.templateEl);

            // Set title
            $('h1.title', this.$el).text(this.defaults.title);

            // Fill form
            this.form = this.$el.form();
            this.form.clear();
            this.form.fill(this.model.toJSON());

            // get Customers collection
            var customers = App.session.get('customers', function () {
                return new App.Collection.Customers();
            });
            var selectBox = new App.Views.Core.Select({
                el:this.form.get('customer'),
                collection:customers,
                defaults:{
                    selected:this.model.get('customer')
                }
            });
            customers.fetch();

            return this;
        },
        slugify:function (e) {
            var alias = $('#project-alias', this.$el);
            alias.val(App.Helper.Format.Slugify($('#project-name', this.$el).val()));
        },
        alias:function (e) {
            var keyCode = (e.keyCode) ? e.keyCode : e.which,
                keyChar = String.fromCharCode(keyCode);

            if ((keyCode == null) || $.inArray(keyCode, [0,8,9,13,27,37,39,46]) > -1) {
                return true;
            }

            if (keyChar.match(/[a-zA-Z0-9-_]/)) {
                return true;
            } else {
                return false;
            }
        }
    }));

})(jQuery, Dime);
