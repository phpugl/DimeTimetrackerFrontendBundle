'use strict';

/*
 * Dime - core/views/autocomplete.js
 */
(function ($, App) {
    App.provide('Views.Core.Autocomplete', Backbone.View.extend({
        el:'#activity-track-input',
        events:{
            'blur': 'hideAutocompletion',
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
        hideAutocompletion:function () {
            $('#' + this.defaults.autocompleteListId).hide();
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
            if (0 < this.$el.val().length
                && that.suggestions
                && "({})" != that.suggestions.toSource()
            ) {
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
            /* define some prefixes that trigger a specific collection type */
            activity: ' ',
            customer: '@',
            project:  '/',
            service:  ':',
            tag:      '#'
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
            if ('activity' == this.mode) {
                /* no activity autocompletion (this may be a huge collection!) */
                return;
            }
            this.recentWord = val.substr(lastIndicatorIndex + 1);

            /* get plural form of given mode */
            var collectionName = 'activity' == this.mode ? 'activities' : this.mode + 's';
            collectionName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);

            var collectionClass = App.Collection[collectionName];
            this[this.mode + 'Collection'] = App.session.get(
                this.mode + '-filter-collection',
                function () { return new collectionClass(); }
            );

            var updateSuggestionsCallback = function() {
                that.updateSuggestions(that[that.mode + 'Collection']);
            }
            if (this[this.mode + 'Collection']) {
                updateSuggestionsCallback(that[that.mode + 'Collection']);
                return;
            }

            this[this.mode + 'Collection'].fetch({success: updateSuggestionsCallback});
        },
        updateSuggestions: function(collection) {
            /* filter suggestions depending on user input */
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
