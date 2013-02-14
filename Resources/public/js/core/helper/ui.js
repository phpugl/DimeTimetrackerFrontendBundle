'use strict';

/**
 * Dime - core/helper/ui.js
 *
 * Register Activity model to namespace App.
 */
(function (App, $, _) {

    /**
     * Dime.Helper.Object.Set
     *
     * @param obj
     * @param path dot-separated string or array
     * @param value
     * @return obj
     */
    App.provide('Helper.Object.Set', function(obj, path, value) {
        if (_.isString(path)) {
            path = path.split('.');
        }
        var parent = obj,
            len = path.length;

        for (var i=0; i<len; i++) {
            var name = path[i];
            if (i >= len - 1) {
                if (name.search(/\[\]/) !== -1) {
                    name = name.replace('[]', '');
                    if (parent[name] === undefined) {
                        parent[name] = [];
                    }
                    parent[name].push(value);
                } else {
                    parent[name] = value;
                }
            } else if (parent[name] === undefined) {
                parent[name] = {};
            }
            parent = parent[name];
        }

        return obj;
    });

    /**
     * Dime.Helper.Object.Get
     *
     * @param obj
     * @param path dot-separated string or array
     * @return value of path or undefined
     */
    App.provide('Helper.Object.Get', function(obj, path) {
        if (obj && path) {
            if (_.isString(path)) {
                path = path.split('.');
            }

            var parent = obj;
            for (var i=0; i<path.length; i++) {
                var name = path[i].replace('[]', '');
                if (parent[name]) {
                    parent = parent[name];
                } else {
                    parent = undefined;
                    break;
                }
            }

            return parent;
        }
        return undefined;
    });

    App.provide('Helper.UI.Form.Bind', function($form, data, ignore) {
        ignore = ignore || {};

        $(':input', $form).each(function (idx, input) {
            var $input = $(input),
                name = input.name || input.id;

            if (name && !ignore[name]) {
                var parts = name.split('-'),
                    value = App.Helper.Object.Get(data, parts);

                if (value !== undefined) {
                    if (input.type && input.type == 'checkbox' || input.type == 'radio') {
                        if (value) {
                            $input.attr('checked', 'checked');
                        } else {
                            $input.removeAttr('checked');
                        }
                    } else {
                        $input.val(value);
                    }
                }
            }
        });
    });

    App.provide('Helper.UI.Form.BindError', function($form, errors) {
        $('.control-group', $form).removeClass('error');

        if (errors) {
            for (var name in errors) if (errors.hasOwnProperty(name)) {
                // TODO
//                var input = this.targetComponent(name);
//                if (input.length > 0) {
//                    var group = input.parents('.control-group');
//                    group.addClass('error');
//                    $('span.help-inline', group).text(data[name]);
//                }
            }
        }
    });

    App.provide('Helper.UI.Form.Clear', function($form, ignore) {
        ignore = ignore || {};

        $(':input', this.$el).each(function (idx, input) {
            var $input = $(input),
                name = input.name || input.id;

            if (name && !ignore[name]) {
                if (input.type && input.type == 'checkbox' || input.type == 'radio') {
                    input.checked = false;
                } else if (tag == 'select') {
                    input.selectedIndex = -1;
                } else {
                    $input.val(undefined);
                }
            }
        });
    });

    App.provide('Helper.UI.Form.Serializer', function($form, ignore, withoutEmpty) {
        ignore = ignore || {};
        var data = {};

        $(':input[name]', $form).each(function (idx, input) {
            var $input = $(input),
                name = input.name;

            if (name) {
                var val = $input.val(),
                    parts = name.split('-');

                if (input.type && input.type == 'checkbox' || input.type == 'radio') {
                    if (($input.attr('checked') == 'checked')) {
                        App.Helper.Object.Set(data, parts, true);
                    } else {
                        App.Helper.Object.Set(data, parts, undefined);
                    }
                } else if (input.type && input.type != 'button') {
                    if (withoutEmpty) {
                        if (val === undefined || _.isEmpty(val)) {
                            return;
                        }
                    }
                    App.Helper.Object.Set(data, parts, val);
                }
            }
        });

        return data;
    });

})(Dime, jQuery, _);
