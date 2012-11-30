'use strict';

/**
 * Dime - app/timeslice/routes.js
 */
(function ($, moment, App) {

    App.router.route("timeslice/:id/edit", "timeslice:edit", function (id) {
        var model = new App.Model.Timeslice({id:id});
        model.fetch({async:false});

        App.menu.activateItem('activity');
        App.router.switchView(new App.Views.Timeslice.Form({
            defaults:{
                title:'Edit Timeslice',
                template:'DimeTimetrackerFrontendBundle:Timeslices:form',
                templateEl:'#timeslice-form',
                backNavigation:'activity/' + model.relation('activity').get('id') + '/edit'
            },
            model:model
        }));
    });

    App.router.route("activity/:id/timeslice/add", "activity:add-timeslice", function (id) {
        var activity = new App.Model.Activity({id:id});
        activity.fetch({async:false});

        var model = new App.Model.Timeslice({
            activity:activity.get('id')
        });

        model.set({
            'startedAt-date': moment().format('YYYY-MM-DD'),
            'stoppedAt-date': moment().format('YYYY-MM-DD')
        }, {silent: true});

        App.menu.activateItem('activity');
        App.router.switchView(new App.Views.Timeslice.Form({
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
