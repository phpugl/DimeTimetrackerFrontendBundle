/**
 * Dime - app/project/index.js
 */
(function ($, App) {

  // Add menu item to main menu
  App.menu({
    name: "project",
    title: "Project",
    route: "project",
    weight: 0,
    callback: function() {
      App.UI.menu.activateItem('project');
      App.UI.router.switchView(new App.Views.Project.Index());
    }
  });

  // Define Routes
  App.route("project:add", "project/add", function() {
    var model = new App.Model.Project();
    
    App.UI.menu.activateItem('project');
    App.UI.router.switchView(new App.Views.Project.Form({
      defaults: {
        title: 'Add Project',
        template: 'DimeTimetrackerFrontendBundle:Projects:form',
        templateEl: '#project-form',
        backNavigation: 'project'
      },
      model: model
    }));
  });
  App.route("project:edit", "project/:id/edit", function(id) {
    var model = new App.Model.Project({id: id});
    model.fetch({async: false});

    App.UI.menu.activateItem('project');
    App.UI.router.switchView(new App.Views.Project.Form({
      defaults: {
        title: 'Edit Project',
        template: 'DimeTimetrackerFrontendBundle:Projects:form',
        templateEl: '#project-form',
        backNavigation: 'project'
      },
      model: model
    }));
  });

  // Project view
  App.provide('Views.Project.Index', App.Views.Core.Content.extend({
    template: 'DimeTimetrackerFrontendBundle:Projects:index',
    render: function() {
      this.projects = new App.Collection.Projects();
      this.projectList = new App.Views.Core.List({
        el: '#projects',
        collection: this.projects,
        defaults: {
          prefix: 'project-',
          item: {
            attributes: { "class": "project" },
            tagName: "tr",
            template: '#tpl-project-item',
            View: App.Views.Project.Item
          }
        }
      }).render();
      this.projects.fetch();
    }
  }));

})(jQuery, Dime);