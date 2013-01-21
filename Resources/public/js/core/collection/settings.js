'use strict';

/**
 * Dime - collection/settings.js
 *
 * Register Settings collection to namespace App
 */
(function ($, App) {

    // Create Settings collection and add it to App.Collection
    App.provide('Collection.Settings', App.Collection.Base.extend({
        model:App.Model.Setting,
        url:App.Route.Settings,
        values: function(namespace) {
            var result = {}, models;

            models = this.models;
            if (namespace) {
                models = this.where({ "namespace": namespace });
            }

            if (models) {
                for (var i=0; i<models.length; i++) {
                    result[models[i].get('name')] = models[i].get('value');
                }
            }

            return result;
        }
    }));

})(jQuery, Dime);

