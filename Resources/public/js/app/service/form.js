'use strict';

/**
 * Dime - app/service/form.js
 */
(function ($, App) {

    App.provide('Views.Service.Form', App.Views.Core.Form.extend({
        ui:{
            aliasModified:false
        },
        events:{
            'click .save':'save',
            'click .close':'close',
            'click .cancel':'close',
            'click .slugify':'slugify',
            'keypress #service-alias':'alias'
        },
        slugify:function (e) {
            var alias = $('#service-alias', this.$el);
            alias.val(App.Helper.Format.Slugify($('#service-name', this.$el).val()));
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