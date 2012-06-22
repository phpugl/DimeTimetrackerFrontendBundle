"use strict";

/**
 * Dime - app/customer/form.js
 */
(function ($, App) {

    App.provide('Views.Customer.Form', App.Views.Core.Form.extend({
        ui:{
            aliasModified:false
        },
        events:{
            'click .save':'save',
            'click .close':'close',
            'click .cancel':'close',
            'click .slugify':'slugify',
            'keypress #customer-alias':'alias'
        },
        slugify:function (e) {
            var alias = $('#customer-alias', this.$el);
            alias.val(App.Helper.Format.Slugify($('#customer-name', this.$el).val()));
        },
        alias:function (e) {
            var keyCode = (e.keyCode) ? e.keyCode : e.which,
                keyChar = String.fromCharCode(keyCode);

            if ((keyCode == null) || $.inArray(keyCode, [0,8,9,13,27,37,39]) > -1) {
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