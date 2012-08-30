Structure and Convention about Javascript modules
=================================================

File Structure
--------------

Location: ``Resources/public/js``

::

    app/
      module/       ... Module sub folder
      ...
      main.js       ... Main stuff which not belong to a module
      router.js     ... Backbone router which provide to switch views
    core/           ... Core file which are needed in ever module
      collection/   .., Location for core backbone collections
      helper/       .., Location for core helper
      model/        .., Location for core backbone model
      views/        .., Location for core views
    plugins/        ... Location for plugins (e.g. jQuery)
    vendors/        ... Location for vendor libraries
    application.js  ... Initialize Dime namespace

Initialization order
--------------------

The order of initalization will be define in the ``Resources/config/config.yml``. There you find all the assets.

#. vendors (json2, jquery, underscore, backbone, ...)
#. plugins
#. app

Namespace "dime"
----------------

The namespace dime contain all the logic and object to build the gui.

Location: ``Resources/public/js/application.js``

::

    window.dime = {
      model: {},
      collection: {},
      views: {}
    }

Naming convention
~~~~~~~~~~~~~~~~~

- Collection plural ('activities', 'customers', ...)
- Model singular ('activity', 'customer', ...)
- Views singular ('activity.list', 'activity.item', ...)

Extending and override the namespace
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you want to extend the dime namespace just use the javascript object. You
are free to extend or override objects.

::

    window.dime.model['activity'] = Backbone.Model.extend({});

Basic javascript file structure
-------------------------------

You should use every time you create a new javascript file this following template.

::
    'use strict';

    /**
    * Dime - path/to/file.js
    */
    (function ($, Backbone, _, App) {

        // PUT HERE YOUR CODE

    })(jQuery, Backbone, _, Dime);

The template will set 'use strict' and wrap you code in a closure. So the you can not override something by accident.
