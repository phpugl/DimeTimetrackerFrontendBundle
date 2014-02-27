'use strict';

var dime = angular.module('dime', []);

var BaseCtrl = function BaseCtrl($scope) {
};
BaseCtrl.$inject = ['$scope'];
dime.controller('BaseCtrl', BaseCtrl)

var NavigationCtrl = function NavigationCtrl($scope) {
    $scope.navigationItems = ["Activities", "Reports", "Administration"];
};
NavigationCtrl.$inject = ['$scope'];
dime.controller('NavigationCtrl', NavigationCtrl);

var FilterCtrl = function FilterCtrl($scope) {
};
FilterCtrl.$inject = ['$scope'];
dime.controller('FilterCtrl', FilterCtrl);

dime.filter('formatHours', function() {
  return function(seconds) {
    return Math.round(
      moment.duration(seconds, 'seconds').asHours() * 100
    )/100;
  }
});
dime.filter('sumDuration', function() {
  return function(timeslices) {
    var duration = 0;
    _.each(timeslices, function(timeslice) {
      duration += timeslice.duration;
    })
    duration = moment.duration(duration, 'seconds');
    var hours = Math.floor(duration.asHours()),
        minute = duration.minutes(),
        second = duration.seconds();

    if (hours<10) {
        hours = '0' + hours;
    }
    if (minute<10) {
        minute = '0' + minute;
    }
    if (second<10) {
        second = '0' + second;
    }

    return [hours, minute, second].join(':');
  }
});
