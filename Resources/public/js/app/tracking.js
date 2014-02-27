'use strict';

function TrackingCtrl($scope, $http) {
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
FilterCtrl.$inject = ['$scope', '$http'];

function ActivityCtrl($scope, $http) {
  $scope.stopRunning = function() {
    _.each($scope.activity.timeslices, function(timeslice, offset) {
      if (_.isNull(timeslice.stopped_at) || _.isUndefined(timeslice.stopped_at)) {
        $scope.stopTimeslice(timeslice, function(err, timeslice) {
          if (err) {
            console.error(err);
          } else {
            $scope.activity.timeslices[offset] = timeslice;
          }
        });
      }
    });
  };
  $scope.startTimeslice = function() {
    var timeslice = {
      activity_id: $scope.activity.id,
      started_at:  moment().format('YYYY-MM-DD HH:mm:ss')
    }
    var url = config.backend.url + '/timeslices';
    $http.post(url, timeslice).success(function(timeslice) {
      $scope.activity.timeslices.unshift(timeslice);
    });
  };
  $scope.stopTimeslice = function(timeslice, done) {
    timeslice.stopped_at = moment().format('YYYY-MM-DD HH:mm:ss');
    timeslice.duration   = moment(timeslice.stopped_at).diff(moment(timeslice.started_at), 'seconds');
    $scope.saveTimeslice(timeslice, done);
  };
  $scope.saveTimeslice = function(timeslice, done) {
    var url = config.backend.url + '/timeslices/' + timeslice.id;
    $http.put(url, timeslice).success(function(timeslice, status) {
      if (200 === status) {
        done(null, timeslice);
      } else {
        done(status, timeslice);
      }
    }).error(function (err){
      done(err);
    });
  };
  $scope.toggleRunning = function() {
    if ($scope.isRunning()) {
      $scope.stopRunning();
    } else {
      $scope.startTimeslice();
    }
  }

  $scope.isRunning = function() {
    return _.some($scope.activity.timeslices, function(timeslice) {
      return _.isUndefined(timeslice.duration)
        || _.isNull(timeslice.duration)
        || 0 === timeslice.duration;
    });
  }
}
ActivityCtrl.$inject = ['$scope', '$http'];

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
