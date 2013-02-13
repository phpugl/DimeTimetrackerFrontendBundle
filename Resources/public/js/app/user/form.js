'use strict';

/**
 * Dime - app/user/form.js
 */
(function ($, App) {

  App.provide('Views.User.Form', App.Views.Core.Content.extend({
      options: {},
      template:'DimeTimetrackerFrontendBundle:Users:form',
      initialize: function(config) {
          if (config) {
              if (config.options) {
                  this.options = $.extend(true, {}, this.options, config.options);
              }
          }
      },
      render: function() {
          if (this.options.title) {
              this.$('header.page-header h1').text(this.options.title)
          }

          this.form = new App.Views.Core.Form.Model({
              el: '#user-form',
              model: this.model
          });
          this.form.render();

          return this;
      }
  }));

})(jQuery, Dime);
