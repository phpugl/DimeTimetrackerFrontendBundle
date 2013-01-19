'use strict';

/**
 * Dime - app/customer/form.js
 */
(function ($, App) {

    App.provide('Views.Customer.Form', App.Views.Core.Form.extend({
        defaults: {
            events:{
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close',
                'click .slugify':'slugify',
                'keypress #customer-alias':'alias'
            }
        },
        slugify:function (e) {
            var alias = $('#customer-alias', this.$el);
            alias.val(App.Helper.Format.Slugify($('#customer-name', this.$el).val()));
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
        },
        render: function () {

            // Set title
            if (this.defaults.title) {
                $('header.page-header h1', this.$el).text(this.defaults.title);
            }

            // Fill form
            this.form = this.$el.form();
            this.form.clear();
            this.form.fill(this.model.toJSON());

            // Render tags
            if (this.model.get('tags')) {
                var tagObjects = this.model.get('tags');
                var tags = [];
                $.each(tagObjects, function(key, el) {
                    tags[key] = el.name;
                });
                this.form.get('tags')[0].value = tags.join(' ');
            }
        },
        presave: function(data) {
            if (data) {
                if (0 < data.tags.length) {
                    data.tags = data.tags.split(' ');
                } else {
                    data.tags = [];
                }
            }
        }
    }));

})(jQuery, Dime);
