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
                'change #activity-customer':'customerChange',
                'change #activity-project':'projectChange',
                'change #activity-rate':'rateChange',
                'change #activity-service':'setPrice'
            }
        },
        initialize:function (opt) {
            // Call parent contructor
            App.Views.Core.Form.prototype.initialize.call(this, opt);

            // Prefill select boxes
            this.customers = App.session.get('customer-filter-collection', function () {
                return new App.Collection.Customers();
            });

            this.projects = App.session.get('project-filter-collection', function () {
                return new App.Collection.Projects();
            });

            this.services = App.session.get('service-filter-collection', function () {
                return new App.Collection.Services();
            });

            this.activityFilter = App.session.get('activity-filter');
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

            this.customerSelect = new App.Views.Core.Select({
                el:this.form.get('customer'),
                collection: this.customers,
                options: {
                    selected: this.model.get('customer')
                }
            }).render();
            this.customers.fetch();
            if (this.activityFilter && this.activityFilter.customer) {
                this.customerSelect.select(this.activityFilter.customer);
            }

            this.projectSelect = new App.Views.Core.Select({
                el:this.form.get('project'),
                collection:this.projects,
                options: {
                    selected: this.model.get('project')
                }
            }).render();
            if (this.model.get('customer')) {
                this.projects.fetch({ data: { filter: { customer: this.model.get('customer') } }, wait: true });
            } else {
                this.projects.fetch();
            }
            if (this.activityFilter && this.activityFilter.project) {
                this.projectSelect.select(this.activityFilter.project);
                if (!this.activityFilter.customer) {
                    this.customerFilter.select();
                }
            }

            this.serviceSelect = new App.Views.Core.Select({
                el:this.form.get('service'),
                collection:this.services,
                options: {
                    selected: this.model.get('service')
                }
            }).render();
            this.services.fetch();
            if (this.activityFilter && this.activityFilter.service) {
                this.serviceSelect.select(this.activityFilter.service);
            }

            // Render tags
            if (this.model.get('tags')) {
                var tagObjects = this.model.get('tags');
                var tags = [];
                $.each(tagObjects, function(key, el) {
                    tags[key] = el.name;
                });
                this.form.get('tags')[0].value = tags.join(' ');
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
            return this;
        },
        projectChange: function(e) {
            if (e) {
                e.preventDefault();

                var $component = $(e.currentTarget);

                if ($component.val() !== '') {
                    var project = this.projects.get($component.val());
                    this.customerSelect.select(project.get('customer'));
                }
                this.setPrice();
            }
            return this;
        },
        rateChange: function(e) {
            if (e) {
                e.preventDefault();

                var $component = $(e.currentTarget),
                    rateRef = $('#activity-rateReference');

                if ($component.val() === '') {
                    rateRef.val('');
                } else {
                    rateRef.val('manual');
                }
            }
            return this;
        },
        setPrice: function(e) {
            if (e) {
                e.preventDefault();
            }

            var rate = $('#activity-rate'),
                rateRef = $('#activity-rateReference'),
                rateRefValue = rateRef.val();

            if (rateRefValue == '' || rateRefValue.search(/service|customer|project/) != -1) {
                if (this.serviceSelect.value()) {
                    var service = this.services.get(this.serviceSelect.value());
                    if (service.get('rate')) {
                        rate.val(service.get('rate'));
                        rateRef.val('service');
                    }
                } else {
                    rate.val('');
                    rateRef.val('');
                }
                if (this.projectSelect.value()) {
                    var project = this.projects.get(this.projectSelect.value());
                    if (project.get('rate')) {
                        rate.val(project.get('rate'));
                        rateRef.val('project');
                    }
                }
            }

            return this;
        }
    }));

})(jQuery, Dime);
