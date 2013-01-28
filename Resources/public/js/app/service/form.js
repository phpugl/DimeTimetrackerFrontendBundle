'use strict';

/**
 * Dime - app/service/form.js
 */
(function ($, App) {

    App.provide('Views.Service.Form', App.Views.Core.Form.extend({
        options: {
            events:{
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close',
                'click .slugify':'slugify',
                'keypress #service-alias':'alias'
            }
        },
        render: function () {
            // Call parent contructor
            App.Views.Core.Form.prototype.render.call(this);

            // Render tags
            if (this.model.relation('tags')) {
                var tags = this.targetComponent('tags');
                tags.val(this.model.relation('tags').pluck('name').join(' '));
            }
            return this;
        },
        presave: function(data) {
            if (data) {
                if (0 < data.tags.length) {
                    data.tags = data.tags.split(' ');
                } else {
                    data.tags = [];
                }
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
