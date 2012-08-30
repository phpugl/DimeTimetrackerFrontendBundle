Extend the Frontend
===================

The best way to extend the frontend is to create new bundle (e.g. DimeReportBundle). Add the bundle to you Dime
installation. Basically you need the following structure.

DimeReportBundle basic stucture
-------------------------------

::
    Dime/
        ReportBundle/
            DependencyInjection/
            Resources/
                config/
                    config.yml          ... add your js files to the asset configuration
                public/
                    js/                 ... put here your js code
                views/
             DimeReportBundle.php
             composer.json
             README.mkd


Add extension start point
-------------------------

Create a new javascript file within the public/js folder and add the basic file structure. Now you can start to create a
menu and your first route.

::
    'use strict';

    /**
    * Dime - app/report/index.js
    */
    (function ($, Backbone, _, App) {

        // add menu item
         App.menu({
             name:"report",            // unique name
             title:"Report",           // menu title
             route:"report",           // route
             weight: 0,                // weight to order the menu
             callback:function () {    // callback to switch the view
                 // activate menu item
                 App.UI.menu.activateItem('report');

                 // switch to you defined index view
                 App.UI.router.switchView(new App.Views.Report.Index());
             }
         });


         // create index view and render the remote template
         App.provide('Views.Report.Index', App.Views.Core.Content.extend({
             template:'DimeReportBundle:Reports:index',
             initialize:function () {
                 // Bind all to this, because you want to use
                 // "this" view in callback functions
                 _.bindAll(this);

             }
         }));


    })(jQuery, Backbone, _, Dime);

