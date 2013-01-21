'use strict';

/**
 * Dime - collection/base.js
 *
 * Register Customers collection to namespace App
 */
(function ($, Backbone, _, App) {

    // Create Base collection and add it to App.Collection
    App.provide('Collection.Base', Backbone.Collection.extend({
        fetchOptions: {
            data: {}
        },
        load: function() {
            if (this.fetchOptions) {
                this.fetch(this.fetchOptions);
            } else {
                this.fetch();
            }
        },
        setFetchOption: function(name, opt) {
            if (name) {
                this.fetchOptions[name] = opt;
            }
        },
        setFetchData: function(name, data) {
            if (name) {
                this.fetchOptions.data[name] = data;
            }
            return this;
        },
        mergeFetchData: function(data) {
            if (data) {
                for (var name in data) {
                    if (data.hasOwnProperty(name)) {
                        this.setFetchData(name, data[name]);
                    }
                }
            }
        },
        removeFetchData: function(name) {
            if (this.fetchOptions && this.fetchOptions.data && this.fetchOptions.data[name]) {
                delete this.fetchOptions.data[name];
            }
            return this;
        }
    }));

})(jQuery, Backbone, _, Dime);

