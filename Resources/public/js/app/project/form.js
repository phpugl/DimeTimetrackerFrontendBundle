/**
 * Dime - app/project/form.js
 */
(function ($, App) {

  App.provide('Views.Project.Form', App.Views.Core.Form.extend({
    ui: {
      aliasModified: false
    },
    events: {
      'click .save': 'save',
      'click .close': 'close',
      'click .cancel': 'close',
      'keypress #project-name': 'slugify',
      'keypress #project-alias': 'alias'
    },
    render: function() {
      this.setElement(this.defaults.templateEl);

      // Set title
      $('h1.title', this.$el).text(this.defaults.title);

      // Fill form
      this.form = this.$el.form();
      this.form.clear();
      this.form.fill(this.model.toJSON());

      // get Customers collection
      var customers = new App.Collection.Customers();
      var selectBox = new App.Views.Base.Select({
        el: this.form.get('customer'),
        collection: customers,
        defaults: {
          selected: this.model.get('customer')
        }
      });
      customers.fetch();
      
      return this;
    },
    slugify: function(e) {
      var alias = $('#project-alias', this.$el);
      if (alias.val() === '') {
        this.aliasModified = false;
      }

      if (!this.aliasModified) {
        var text = $('#project-name', this.$el).val().toLowerCase();

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