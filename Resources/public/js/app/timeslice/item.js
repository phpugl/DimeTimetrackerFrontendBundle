'use strict';

/**
 * Dime - app/timeslice/item.js
 */
(function ($, App) {

    // activity item view
    App.provide('Views.Timeslice.Item', Backbone.View.extend({
        template:'#tpl-timeslice-item',
        events:{
            'click .edit':'edit',
            'click .delete':'delete'
        },
        options:{
            prefix:'timeslice-'
        },
        elId:function () {
            var id = this.$el.attr('id');
            return (id) ? id : this.options.prefix + this.model.get('id');
        },
        initialize:function (config) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            // Grep default values from option
            if (config && config.options) {
                this.options = _.extend({}, this.options, config.options);
            }

            // bind remove function to model
            this.model.bind('destroy', this.remove, this);
        },
        render:function () {
            // grep template with jquery and generate template stub
            var temp = App.template(this.template);

            // fill model date into template and push it into element html
            this.$el.html(temp({
                model:this.model,
                data:this.model.toJSON()
            }));

            // add element id with prefix
            this.$el.attr('id', this.elId());

            return this;
        },
        edit:function (e) {
            e.stopPropagation();
        },
        'delete':function (e) {
            e.preventDefault();
            e.stopPropagation();

            // confirm destroy action
            if (confirm("Are you sure?")) {
                this.model.destroy({wait:true});
                this.model.collection.remove(this.model);
            }
        }
    }));

})(jQuery, Dime);
