'use strict';

/*
 * Dime - app/main.js
 */
(function ($, App) {

    // Define home route
    App.router.route("", "home", function () {
        App.menu.activateItem('activity');
        App.router.switchView(new App.Views.Activity.Index());
    });

    // Define management menu
    App.menu.add({
        id:'management',
        title:'Administration',
        weight:10
    });

    // Define help menu
    App.provide('Views.Help', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:App:help'
    }));
    App.menu.add({
        id:"help",
        title:"Help",
        route:"help",
        weight:1000,
        callback:function () {
            App.menu.activateItem('help');
            App.router.switchView(new App.Views.Help());
        }
    });

    // Initialize router
    App.hook.add({
        id: 'router',
        scope: 'initialize',
        weight: 9999,
        callback: function() {
            App.router.setElement('#area-content');
            Backbone.history.start();
        }
    });

})(jQuery, Dime);

