'use strict';

/**
 * Dime - app/activity/form.js
 */
(function ($, App) {

    // Activity form view
    App.provide('Views.Activity.Form', App.Views.Core.Form.extend({
        defaults:{
            backNavigation:'',
            events:{
                'submit form':'save',
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close',
                'change #activity-customer':'customerChange'
            }
        },
        render:function () {
            this.setElement(this.defaults.templateEl);

            App.session.set('current.model', this.model);

            // Set title
            if (this.defaults.title) {
                $('header.page-header h1', this.$el).text(this.defaults.title);
            }

            // Fill form
            this.form = this.$el.form();
            this.form.clear();
            this.form.fill(this.model.toJSON());

            // Prefill select boxes
            this.customers = App.session.get('customer-filter-collection', function () {
                return new App.Collection.Customers();
            });
            this.customerSelect = new App.Views.Core.Select({
                el:this.form.get('customer'),
                collection: this.customers,
                defaults: {
                    selected: this.model.get('customer')
                }
            }).render();
            this.customers.fetch();

            this.projects = App.session.get('project-filter-collection', function () {
                return new App.Collection.Projects();
            });
            this.projectSelect = new App.Views.Core.Select({
                el:this.form.get('project'),
                collection:this.projects,
                defaults: {
                    selected: this.model.get('project')
                }
            }).render();
            if (this.model.get('customer')) {
                this.projects.fetch({ data: { filter: { customer: this.model.get('customer') } }, wait: true });
            } else {
                this.projects.fetch();
            }

            this.services = App.session.get('service-filter-collection', function () {
                return new App.Collection.Services();
            });
            this.serviceSelect = new App.Views.Core.Select({
                el:this.form.get('service'),
                collection:this.services,
                defaults: {
                    selected: this.model.get('service')
                }
            }).render();
            this.services.fetch();

            // Render tags
            var tagObjects = this.model.get('tags');
            var tags = [];
            $.each(tagObjects, function(key, el) {
                tags[key] = el.name;
            });
            this.form.get('tags')[0].value = tags.join(' ');

            // Render timeslices
            if (this.model.relation('timeslices')) {
                this.activityList = new App.Views.Core.List({
                    el:'#tab-timeslices',
                    template:'#tpl-timeslices',
                    templateEl:'#timeslices',
                    model:this.model,
                    collection:this.model.relation('timeslices'),
                    defaults:{
                        prefix:'timeslice-',
                        emptyTemplate: '#tpl-timeslice-empty',
                        item:{
                            attributes:{ "class":"timeslice" },
                            prepend:true,
                            tagName:"tr",
                            View:App.Views.Timeslice.Item
                        }
                    }
                }).render();
            } else {
                $('a[href="#tab-timeslices"]', this.$el).remove();
            }

            return this;
        },
        presave: function(data) {
            if (data) {
                data.tags = data.tags.split(' ');
            }
        },
        customerChange: function(e) {
            if (e) {
                e.preventDefault();

                var $component = $(e.currentTarget);

                if ($component.val() !== '') {
                    this.projects.fetch({ data: { filter: { customer: $component.val() } }, wait: true });
                } else {
                    this.projects.fetch();
                }
            }
        }
    }));

})(jQuery, Dime);