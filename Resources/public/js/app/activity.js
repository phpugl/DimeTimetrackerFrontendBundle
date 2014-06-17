'use strict';
function ActivityCtrl($scope, $http) {
  $scope.showCustomerList = false;
  $scope.showProjectList  = false;
  $scope.showServiceList  = false;
  $scope.showTimeslices   = false;

  $scope.stopRunning = function() {
    angular.forEach($scope.activity.timeslices, function(timeslice, offset) {
      if ( null === timeslice.stopped_at || angular.isUndefined(timeslice.stopped_at)) {
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
    var isRunning = false;
    return angular.forEach($scope.activity.timeslices, function(timeslice) {
      if (angular.isUndefined(timeslice.duration)
        || null === timeslice.duration
        || 0 === timeslice.duration
        ) {
          isRunning = true;
        }
    });
    return isRunning;
  }
}
ActivityCtrl.$inject = ['$scope', '$http'];
dime.controller('ActivityCtrl', ActivityCtrl);

(function(ng) {
  var NS = 'tracking:activity';
  var module = ng.module(NS, []);
}(angular));
