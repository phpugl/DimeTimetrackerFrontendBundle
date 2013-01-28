'use strict';

/**
 * Dime - core/views/form.js
 */
(function ($, Backbone, App) {

    /**
     * Dime.Views.Core.Form
     *
     * extend App.Views.Core.Content
     * bind model data to form item via prefix
     */
    App.provide('Views.Core.Form', App.Views.Core.Content.extend({
        events: {
            'submit form':'save',
            'click .save':'save',
            'click .close':'close',
            'click .cancel':'close'
        },
        options: {
            backNavigation:'',
            prefix: '',
            ui: {}
        },
        initialize: function(config) {
            _.bindAll(this);

            if (config) {
                if (config.template) {
                    this.template = config.template;
                }

                if (config.options) {
                    this.options = $.extend(true, {}, this.options, config.options);
                }
            }

            this.component = $('form', this.$el);
        },
        render: function() {
            // Set title
            if (this.options.ui.titleElement && this.options.ui.title) {
                $(this.options.ui.titleElement, this.$el).text(this.options.ui.title);
            }

            // Get prefix
            if (this.formComponent && this.formComponent.data('prefix')) {
                this.options.prefix = this.formComponent.data('prefix');
            }

            // Bind model data
            this.bind();

            return this;
        },
        save:function (e) {
            if (e) {
                e.preventDefault();
            }

            var that = this;

            $('.save').append(' <i class="icon loading-14-white"></i>');
            $('.cancel').attr('disabled', 'disabled');

            this.formData = this.serialize();

            if (this.presave) {
                this.presave(this.formData);
            }

            this.model.save(this.formData, {
                wait:true,
                success:function () {
                    App.notify("Nice, all data are saved properly.", "success");
                    that.close();
                },
                error:function (model, response, scope) {
                    $('.save i.icon').remove();
                    $('.cancel').removeAttr('disabled');
                    var data = $.parseJSON(response.responseText);

                    if (data.errors) {
                        that.showErrors(data.errors);
                        App.notify("Hey, you have missed some fields.", "error");
                    } else {
                        App.notify(response.status + ": " + response.statusText, "error");
                    }

                }
            });
        },
        close:function (e) {
            if (e) {
                e.stopPropagation();
            }

            App.router.navigate(this.options.backNavigation, { trigger:true });
        },
        bind: function(data) {
            data = data || this.model.toJSON();

            for (var name in data) {
                if (data.hasOwnProperty(name)) {
                    var input = this.targetComponent(name);
                    if (input.length > 0) {
                        var type = input[0].type;
                        if (type && type == 'checkbox' || type == 'radio') {
                            if (data[name]) {
                                input.attr('checked', 'checked');
                            } else {
                                input.removeAttr('checked');
                            }
                        } else {
                            input.val(data[name]);
                        }
                    }
                }
            }
        },
        clear:function () {
            $(':input', this.$el).each(function (idx, el) {
                var type = el.type;
                var tag = el.tagName.toLowerCase();
                if (type == 'text' || type == 'password' || tag == 'textarea')
                    $(el).val("");
                else if (type == 'checkbox' || type == 'radio')
                    el.checked = false;
                else if (tag == 'select')
                    el.selectedIndex = -1;
            });
        },
        showErrors:function (data) {
            $('.control-group', this.$el).removeClass('error');

            if (data) {
                for (var name in data) if (data.hasOwnProperty(name)) {
                    var input = this.targetComponent(name);
                    if (input.length > 0) {
                        var group = input.parents('.control-group');
                        group.addClass('error');
                        $('span.help-inline', group).text(data[name]);
                    }
                }
            }
        },
        serialize: function(withoutEmpty) {
            var data = {},
                that = this;

            $(':input', this.$el).each(function (idx, el) {
                var $el = $(el);
                if (el.id && el.id.search(that.options.prefix) != -1) {
                    var val = $el.val();
                    if (withoutEmpty) {
                        if (val && val != '') {
                            if (el.type && el.type == 'checkbox' || el.type == 'radio') {
                                if ($el.attr('checked') == 'checked') {
                                    data[el.id.replace(that.options.prefix, '')] = val;
                                }
                            } else {
                                data[el.id.replace(that.options.prefix, '')] = val;
                            }
                        }
                    } else {
                        if (el.type && el.type == 'checkbox' || el.type == 'radio') {
                            if ($el.attr('checked') == 'checked') {
                                data[el.id.replace(that.options.prefix, '')] = val;
                            } else {
                                data[el.id.replace(that.options.prefix, '')] = undefined;
                            }
                        } else {
                            data[el.id.replace(that.options.prefix, '')] = val;
                        }
                    }
                }
            });

            return data;
        },
        targetComponent: function(name) {
            return $('#' + this.options.prefix + name, this.formComponent);
        }
    }));

})(jQuery, Backbone, Dime);
