'use strict';

/**
 * Dime - app/tag/item.js
 */
(function ($, _, moment, App) {

  // tag item view
    App.provide('Views.Tag.Item', App.Views.Core.ListItem.extend({
        events: {
            'click .edit': 'edit',
            'click .delete': 'delete',
            'click': 'showDetails'
        },
        render: function() {
            var that = this;

            // grep template with jquery and generate template stub
            var temp = _.template($(this.template).html());

            // fill model date into template and push it into element html
            this.$el.html(temp({
                model: this.model,
                data: this.model.toJSON()
            }));

            // add element id with prefix
            this.$el.attr('id', this.elId());

            return this;
        },
        showDetails: function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('.details', this.el).toggle();
            this.$el.toggleClass('gap-20');
        },
        edit: function(e) {
            e.stopPropagation();
        },
        'delete': function(e) {
            e.preventDefault();
            e.stopPropagation();

            // confirm destroy action
            if (window.confirm("Are you sure?")) {
                this.model.destroy({wait: true});
            }
        }
    }));

})(jQuery, _, moment, Dime);

