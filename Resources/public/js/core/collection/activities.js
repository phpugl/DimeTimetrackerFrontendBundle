'use strict';

/**
 * Dime - collection/activities.js
 *
 * Register Activities collection to namespace App
 */
(function ($, App) {

    // Create Activities collection and add it to App.Collection
    App.provide('Collection.Activities', App.Collection.Base.extend({
        model:App.Model.Activity,
        url:App.Route.Activities
    }));

})(window.jQuery, window.Dime);

