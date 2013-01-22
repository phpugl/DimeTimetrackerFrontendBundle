'use strict';

/*
 * Dime - core/views/autocomplete.js
 */
(function ($, App) {
    App.provide('Views.Core.Autocomplete', Backbone.View.extend({
        el:'#activity-track-input',
        events:{
            'input':'triggerSuggestions'
        },
        defaults:{
            autocompleteListId: "activity-track-input-suggestion-list"
        },
        initialize:function () {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this, 'triggerSuggestions', 'render');

        },
        render:function () {
            // prepare list
            if ($('#' + this.defaults.autocompleteListId).length) {
                $('#' + this.defaults.autocompleteListId).html('');
            } else {
                var list = document.createElement('ul');
                $(list).attr('id', this.defaults.autocompleteListId);
                $(list).addClass('autocomplete');
                this.$el.parent().append(list);
            }

            var that = this;
            $('#' + this.defaults.autocompleteListId).attr('class', 'autocomplete');
            if (that.suggestions && "({})" != that.suggestions.toSource()) {
                $('#' + this.defaults.autocompleteListId).show();
            } else {
                $('#' + this.defaults.autocompleteListId).hide();
            }
            _.each(that.suggestions, function (name, key) {
                var element = $(document.createElement('li'));
                var completion = key;
                element.html(key + " (" + name + ")");
                $('#' + that.defaults.autocompleteListId).append(element);

                element.mouseover(function() {
                    $(this).addClass('selected')
                    .siblings('.selected').removeClass('selected');
                });
                element.mouseleave(function() {
                    $(this).removeClass('selected');
                });
                element.mousedown(function() {
                    that.$el.val(
                        that.$el.val().replace(
                            that.keys[that.mode] + that.recentWord,
                            that.keys[that.mode] + completion
                        )
                    );
                    $('#' + that.defaults.autocompleteListId).hide();
                    return false;
                });
            });

            return this;
        },
        mode: "activity",
        keys: {
            activity: ' ', // 32
            customer: '@', // 64
            project:  '/', // 47
            service:  ':', // 58
            tag:      '#'  // 35
        },
        triggerSuggestions: function() {
            var lastIndicatorIndex = -1;
            var val = this.$el.val();
            var that = this;
            this.mode = 'activity';
            _.each(this.keys, function (indicator, mode) {
                var currentIndex = val.lastIndexOf(indicator);
                if (lastIndicatorIndex < currentIndex) {
                    that.mode = mode;
                    lastIndicatorIndex = currentIndex;
                }
            });
            this.recentWord = val.substr(lastIndicatorIndex + 1);

            var updateSuggestionsCallback = function() {
                that.updateSuggestions(that[that.mode + 'Collection']);
            }
            if (this[this.mode + 'Collection']) {
                updateSuggestionsCallback(that[that.mode + 'Collection']);
                return;
            }
            switch(this.mode) {
                case 'activity': {
                    var collectionClass = App.Collection.Activities;
                    break;
                }
                case 'tag': {
                    var collectionClass = App.Collection.Tags;
                    break;
                }
                case 'project': {
                    var collectionClass = App.Collection.Projects;
                    break;
                }
                case 'service': {
                    var collectionClass = App.Collection.Services;
                    break;
                }
                case 'customer': {
                    var collectionClass = App.Collection.Customers;
                    break;
                }
            }
            this[this.mode + 'Collection'] = App.session.get(
                this.mode + '-filter-collection',
                function () { return new collectionClass(); }
            );
            this[this.mode + 'Collection'].fetch({success: updateSuggestionsCallback});
        },
        updateSuggestions: function(collection) {
            var that = this;
            var suggestedModels = collection.filter(function (item) {
                var matches = function (haystack, needle) {
                    return (haystack && -1 < haystack.toLowerCase().indexOf(needle.toLowerCase()));
                };
                return (0 == that.recentWord.length
                    || matches(item.get('name'), that.recentWord)
                    || matches(item.get('description'), that.recentWord)
                    || matches(item.get('alias'), that.recentWord)
                );
            });
            this.suggestions = {};
            suggestedModels.forEach(function (model) {
                that.suggestions[model.getAlias()] = model.getName();
            });
            return this.render();
        }
    }));
})(jQuery, Dime);
