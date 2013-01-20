'use strict';

/**
 * Dime - core/model/tag.js
 *
 * Register Tag model to namespace App.
 */
(function ($, Backbone, App) {

    // create Tag model and add it to App.Model
    App.provide('Model.Tag', App.Model.Base.extend({
        urlRoot:App.Route.Tags,
        getAlias: function() {
            return this.toString();
        }
    }));

})(window.jQuery, window.Backbone, window.Dime);

