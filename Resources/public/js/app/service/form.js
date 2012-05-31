/**
 * Dime - app/service/form.js
 */
(function ($, App) {

  App.provide('Views.Service.Form', App.Views.Core.Form.extend({
    ui: {
      aliasModified: false
    },
    events: {
      'click .save': 'save',
      'click .close': 'close',
      'click .cancel': 'close',
      'keypress #service-name': 'slugify',
      'keypress #service-alias': 'alias'
    },
    slugify: function(e) {
      var alias = $('#service-alias', this.$el);
      if (alias.val() === '') {
        this.aliasModified = false;
      }

      if (!this.aliasModified) {
        var text = $('#service-name', this.$el).val().toLowerCase();

        // Source: http://milesj.me/snippets/javascript/slugify
        text = text.replace(/[^-a-zA-Z0-9&\s]+/ig, '');
        text = text.replace(/-/gi, '_');
        text = text.replace(/\s/gi, '-');

        alias.val(text);
      }
    },
    alias: function (e) {
      this.aliasModified = true;
      var keyCode = (e.keyCode) ? e.keyCode : e.which,
          keyChar = String.fromCharCode(keyCode);

      if ((keyCode==null)
          || (keyCode==0)
          || (keyCode==8)
          || (keyCode==9)
          || (keyCode==13)
          || (keyCode==27)) {
        return true;
      }

      if (keyChar.match(/[a-zA-Z0-9\s]/)) {
        return true;
      } else {
        return false;
      }
    }
  }));

})(jQuery, Dime);