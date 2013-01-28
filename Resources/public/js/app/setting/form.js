'use strict';

/**
 * Dime - app/setting/form.js
 */
(function ($, App) {

    App.provide('Views.Setting.Form', App.Views.Core.Form.extend({
        options: {
            events:{
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close',
                'click .slugify':'slugify',
                'keypress #setting-alias':'alias'
            }
        },
        slugify:function (e) {
            var name = this.targetComponent('name'),
                alias = this.targetComponent('alias');
            if (alias) {
                alias.val(App.Helper.Format.Slugify(name.val()));
            }
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
