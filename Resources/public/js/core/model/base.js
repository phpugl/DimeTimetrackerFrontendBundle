'use strict';

/**
 * Dime - model/activity.js
 *
 * Register Activity model to namespace App.
 */
(function ($, Backbone, _, App) {

    // Create Activity model and add it to App.Model
    App.provide('Model.Base', Backbone.Model.extend({
        relations: {},
        relation:function (name, item, defaultValue) {
            var relation = this.get('relation'),
                result = defaultValue;

            if (name) {
                if (relation && relation[name]) {
                    if (item && relation[name].get(item)) {
                        result = relation[name].get(item);
                    } else {
                        result = relation[name];
                    }
                    return result;
                } else {
                    return undefined;
                }
            } else {
                return relation;
            }
        },
        parse: function(response, options) {
            if (this.relations) {
                response.relation = {};

                for (var name in this.relations) {
                    if (this.relations.hasOwnProperty(name)) {
                        var relatedTo = this.relations[name];

                        if (response[name]) {

                            if (relatedTo.model) {
                                var modelFunc = relatedTo.model;
                                if (_.isString(modelFunc)) {
                                    modelFunc = App.provide(modelFunc.replace('App.', ''));
                                }
                                if (relatedTo.collection) {
                                    var collectionFunc = relatedTo.collection;
                                    if (_.isString(collectionFunc)) {
                                        collectionFunc = App.provide(collectionFunc.replace('App.', ''));
                                    }
                                    var collection = new collectionFunc(), ids = [];
                                    _.each(response[name], function (item) {
                                        ids.push(item.id);
                                        if (relatedTo.belongTo) {
                                            var split = relatedTo.belongTo.split(':');
                                            item[split[0]] = (split[1]) ? response[split[1]] : response['id'];
                                        }
                                        collection.add(new modelFunc(item));
                                    });
                                    response.relation[name] = collection;
                                    response[name] = ids;
                                } else {
                                    response.relation[name] = new modelFunc(response[name]);
                                    response[name] = response[name].id;
                                }
                            }
                        }
                    }
                }
            }
            return response;
        }
    }));

})(jQuery, Backbone, _, Dime);
