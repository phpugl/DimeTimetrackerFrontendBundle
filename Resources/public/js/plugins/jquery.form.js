'use strict';

/*
 * jQuery - form
 *
 * handles form filling, clearing and data by input id
 *
 * Usage:
 *
 * <form id="form-id" data-prefix="test-">
 *  <input id="test-id1" value="" >
 *  <input id="test-id2" value="" >
 * </form>
 *
 * var form = $('#form-id').form();
 * form.fill({id1: 'data1', id2: 'data2'});
 * form.data() -> return {id1: 'data1', id2: 'data2'}
 *
 * @package: Dime
 * @author: PHPUGL, http://phpugl.de
 */

(function ($) {

    //
    $.fn.form = function () {
        var $form = $(this),
            prefix = $form.data('prefix') || $('form', $form).data('prefix') || '';

        return {
            data:function (removeEmpty) {
                var data = {};
                if ($form) {
                    $(':input', $form).each(function (idx, el) {
                        var $el = $(el);
                        if (el.id && el.id.search(prefix) != -1) {
                            var val = $el.val();
                            if (removeEmpty) {
                                if (val && val != '') {
                                    if (el.type && el.type == 'checkbox' || el.type == 'radio') {
                                        if ($el.attr('checked') == 'checked') {
                                            data[el.id.replace(prefix, '')] = val;
                                        }
                                    } else {
                                        data[el.id.replace(prefix, '')] = val;
                                    }
                                }
                            } else {
                                if (el.type && el.type == 'checkbox' || el.type == 'radio') {
                                    if ($el.attr('checked') == 'checked') {
                                        data[el.id.replace(prefix, '')] = val;
                                    } else {
                                        data[el.id.replace(prefix, '')] = undefined;
                                    }
                                } else {
                                    data[el.id.replace(prefix, '')] = val;
                                }
                            }
                        }
                    });
                }
                return data;
            },
            get:function (name) {
                var obj = undefined;
                if ($form && name) {
                    obj = $('#' + prefix + name, $form);
                }
                return obj;
            },
            errors:function (data) {
                if ($form) {
                    $('.control-group', $form).removeClass('error');

                    if (data) {
                        for (var name in data) if (data.hasOwnProperty(name)) {
                            var input = $('#' + prefix + name, $form);
                            if (input.length > 0) {
                                var group = input.parents('.control-group');
                                group.addClass('error');
                                $('span.help-inline', group).text(data[name]);
                            }
                        }
                    }
                }
            },
            fill:function (data) {
                if ($form && data) {
                    for (var name in data) if (data.hasOwnProperty(name)) {
                        var input = $('#' + prefix + name, $form);
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
                $(':input', $form).each(function (idx, el) {
                    var type = el.type;
                    var tag = el.tagName.toLowerCase();
                    if (type == 'text' || type == 'password' || tag == 'textarea')
                        $(el).val("");
                    else if (type == 'checkbox' || type == 'radio')
                        el.checked = false;
                    else if (tag == 'select')
                        el.selectedIndex = -1;
                });
            }
        };
    };

})(jQuery);
