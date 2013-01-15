'use strict';

/**
 * Dime - collection/base.js
 *
 * Register Customers collection to namespace App
 */
(function ($, Backbone, _, App) {

    // Create Base collection and add it to App.Collection
    App.provide('Collection.Base', Backbone.Collection.extend({
        fetchData: {},
        pager:{},
        filter: function(filter) {
            if (filter) {
                var data = {};
                for (var name in filter) {
                    if (filter.hasOwnProperty(name)) {
                        switch (name) {
                            case 'date':
                                var date = filter.date.clone();
                                switch (filter['date-period']) {
                                    case 'D':
                                        data.date = date.format('YYYY-MM-DD');
                                        break;
                                    case 'W':
                                        if (date.day() === 0) {
                                            date = date.subtract('days', 1);
                                        }
                                        data.date = [date.day(1).format('YYYY-MM-DD'), date.day(7).format('YYYY-MM-DD')];
                                        break;
                                    case 'M':
                                        data.date = date.format('YYYY-MM');
                                        break;
                                    case 'Y':
                                        data.date = date.format('YYYY');
                                        break;
                                }
                                break;
                            default:
                                data[name] = filter[name];
                        }
                    }
                }
                this.addFetchData({ filter: data });
            }
        },
        addFetchData:function (opt) {
            if (opt) {
                this.fetchData = _.extend({}, this.fetchData, opt);
            }
            return this;
        },
        removeFetchData:function(opt) {
            if (opt) {
                for (var i=0; i<opt.length; i++) {
                    if (this.fetchData[opt[i]]) {
                        delete this.fetchData[opt[i]];
                    }
                }
            }
            return this;
        },
        load: function (opt) {
            if (opt && opt.fetchData) {
                this.fetchData = $.extend(true, {}, this.fetchData, opt.fetchData);
            }

            if (opt && opt.pager) {
                this.fetchData = $.extend(true, {}, this.fetchData, this.getPagerOptions());
            }

            this.fetch({ data: this.fetchData });
        },
        getPager: function() {
            return {
                current: this.pager.page,
                prev: (this.pager.page > 1),
                next: (this.pager.page < this.pageCount()),
                total: this.pageCount()
            };
        },
        resetPager:function () {
          this.pager = {
              count:20,
              page:1,
              total:0
          };
        },
        getPagerOptions:function () {
            var offset = (this.pager.page - 1) * this.pager.count;

            return { limit:this.pager.count, offset:offset };
        },
        pageCount:function () {
            return (this.pager.count > 0) ? Math.floor(this.pager.total / this.pager.count) : 0;
        },
        prevPage:function () {
            if (this.pager.page > 0) {
                this.pager.page -= 1;
            } else {
                this.pager.page = 1;
            }
            this.load({ pager: true });

        },
        setPage:function (num) {
            num = num || 1;
            if (num >= 1 && num <= this.pageCount()) {
                this.pager.page = num;
            } else {
                this.pager.page = 1;
            }
            this.load({ pager: true });
        },
        nextPage:function() {
            if (this.pager.page <= this.pageCount()) {
                this.pager.page += 1;
            } else {
                this.pager.page = this.pageCount();
            }
            this.load({ pager: true });
        },
        parse:function (response, options) {
            if( options && options.hasOwnProperty('getResponseHeader') ){
                options = {
                    xhr: options
                };
            }
            if( options && options.xhr.getResponseHeader('X-Pagination-Total-Results') ){
                this.pager.total = options.xhr.getResponseHeader('X-Pagination-Total-Results');
            }
            return response;
        }
    }));

})(jQuery, Backbone, _, Dime);

