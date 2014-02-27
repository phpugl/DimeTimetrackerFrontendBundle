'use strict';

function TrackingCtrl($scope, $http) {
  $scope.settings = {
    showHoursSum: true,
    showIncomeSum: false
  };
  $scope.filters = {
    date: "today",
    customer: "PHPUGL",
    project: "Dime",
    service: "development"
  }
  $scope.removeFilterCondition = function(condition) {
    alert('To do: remove filter :)')
  }
  $scope.activites = [
  { 
      description: "dummy activity",
      customer: {id: 1, name: "dummy customer"},
      project:  {id: 2, name: "dummy project"},
      service:  {id: 3, name: "dummy service"},
  }
  ];
  $scope.applyFilter = function(activity) {
    if (_.isUndefined($scope.filter)) {
      return true;
    }

    if (_.isString($scope.filter.search)
      && -1 === activity.description.indexOf($scope.filter.search)
    ) {
      return false;
    }

    if (_.isObject($scope.filter.customer)
      && null !== $scope.filter.customer
    ) {
      if (activity.customer.id !== $scope.filter.customer.id) {
        return false;
      }
    }

    if (_.isObject($scope.filter.project)
      && null !== $scope.filter.project
    ) {
      if (activity.project.id !== $scope.filter.project.id) {
        return false;
      }
    }

    if (_.isObject($scope.filter.service)
      && null !== $scope.filter.service
    ) {
      if (activity.service.id !== $scope.filter.service.id) {
        return false;
      }
    }

    if (_.isObject($scope.filter.tag)
      && null !== $scope.filter.tag
    ) {
      if (activity.tag.id !== $scope.filter.tag.id) {
        return false;
      }
    }

    return true;
  }
}
TrackingCtrl.$inject = ['$scope', '$http'];
dime.controller('TrackingCtrl', TrackingCtrl);

(function(ng) {
  var NS = 'tracking:base';
  var module = ng.module(NS, []);
  module.filter('formatHours', function() {
    return function(seconds) {
      return Math.round(
        moment.duration(seconds, 'seconds').asHours() * 100
      )/100;
    }
  });
  module.filter('sumDuration', function() {
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
}(angular));
