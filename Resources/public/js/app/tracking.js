'use strict';

function TrackingCtrl($scope, $http) {
  $scope.showCreateActivityForm = false;
  $scope.settings = {
    showHoursSum: true,
    showIncomeSum: false
  };
  $scope.removeFilterCondition = function(condition) {
    alert('To do: remove filter :)')
  };
  $scope.applyFilter = function(activity) {
    if (angular.isUndefined($scope.filter)) {
      return true;
    }

    if (angular.isString($scope.filter.search)
      && -1 === activity.description.indexOf($scope.filter.search)
    ) {
      return false;
    }

    if (angular.isObject($scope.filter.customer)
      && null !== $scope.filter.customer
    ) {
      if (activity.customer.id !== $scope.filter.customer.id) {
        return false;
      }
    }

    if (angular.isObject($scope.filter.project)
      && null !== $scope.filter.project
    ) {
      if (activity.project.id !== $scope.filter.project.id) {
        return false;
      }
    }

    if (angular.isObject($scope.filter.service)
      && null !== $scope.filter.service
    ) {
      if (activity.service.id !== $scope.filter.service.id) {
        return false;
      }
    }

    if (angular.isObject($scope.filter.tag)
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

function CreateActivityCtrl($scope, $http) {
}
CreateActivityCtrl.$inject = ['$scope', '$http'];
dime.controller('CreateActivityCtrl', CreateActivityCtrl);

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
      angular.forEach(timeslices, function(timeslice) {
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
