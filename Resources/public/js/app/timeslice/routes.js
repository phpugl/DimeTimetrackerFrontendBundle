'use strict';

/**
 * Dime - app/timeslice/routes.js
 */
(function ($, moment, App) {

    App.route("timeslice:edit", "timeslice/:id/edit", function (id) {
        var model = new App.Model.Timeslice({id:id});
        model.fetch({async:false});

        App.UI.menu.activateItem('activity');
        App.UI.router.switchView(new App.Views.Timeslice.Form({
            defaults:{
                title:'Edit Timeslice',
                template:'DimeTimetrackerFrontendBundle:Timeslices:form',
                templateEl:'#timeslice-form',
                backNavigation:'activity/' + model.relation('activity').get('id') + '/edit'
            },
            model:model
        }));
    });

    App.route("activity:add-timeslice", "activity/:id/timeslice/add", function (id) {
        var activity = new App.Model.Activity({id:id});
        activity.fetch({async:false});

        var model = new App.Model.Timeslice({
            activity:activity.get('id')
        });

        model.set({
            'startedAt-date': moment().format('YYYY-MM-DD'),
            'stoppedAt-date': moment().format('YYYY-MM-DD')
        }, {silent: true});

        App.UI.menu.activateItem('activity');
        App.UI.router.switchView(new App.Views.Timeslice.Form({
            defaults:{
                title:'Add Timeslice',
                template:'DimeTimetrackerFrontendBundle:Timeslices:form',
                templateEl:'#timeslice-form',
                backNavigation:'activity/' + activity.get('id') + '/edit'
            },
            model:model
        }));
    });

})(jQuery, moment, Dime);