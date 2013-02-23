'use strict';

/**
 * Dime - core/views/widgets/tags.js
 */
(function ($, Backbone, _, App) {

    App.provide('Views.Core.Widget.Tags', Backbone.View.extend({
        options: {
            delimiter: ' '
        },
        render: function(parent) {
            if (parent) {
                if (this.el === undefined) {
                    this.setElement(parent.el);
                }
            }
        },
        bind: function(data) {
            if (data && data.relation && data.relation.tags) {
                this.$el.val(data.relation.tags.pluck('name').join(this.options.delimiter));
            } else {
                this.$el.val('');
            }
        },
        name: function() {
            return this.options.bind || this.el.name || this.el.id;
        },
        serialize: function(data, withoutEmpty) {
            var name = this.name().split('-'),
                value = this.$el.val();

            if (withoutEmpty) {
                if (value == undefined || _.isEmpty(value)) {
                    return value;
                }
            }

            if (value && value.length > 0) {
                value = value.split(this.options.delimiter);
            } else {
                value = []
            }

            if (data) {
                App.Helper.Object.Set(data, name, value);
            }

            return value;
        }
    }));

})(jQuery, Backbone, _, Dime);
