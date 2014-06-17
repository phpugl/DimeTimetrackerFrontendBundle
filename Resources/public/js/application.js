'use strict';

var dime = angular.module('dime', []);

function getActivities($http, done) {
  if (dime.activities) {
    return done(dime.activities);
  }
  $http.get(apiUrl + '/activities').success(function(data, status) {
    dime.activities = data;
    done(dime.activities);
  });
}

function getCustomers($http, done) {
  if (dime.customers) {
    return done(dime.customers);
  }
  $http.get(apiUrl + '/customers').success(function(data, status) {
    dime.customers = data;
    done(dime.customers);
  });
}

function getProjects($http, done) {
  if (dime.projects) {
    return done(dime.projects);
  }
  $http.get(apiUrl + '/projects').success(function(data, status) {
    dime.projects = data;
    done(dime.projects);
  });
}

function getServices($http, done) {
  if (dime.services) {
    return done(dime.services);
  }
  $http.get(apiUrl + '/services').success(function(data, status) {
    dime.services = data;
    done(dime.services);
  });
}

function getTags($http, done) {
  if (dime.tags) {
    return done(dime.tags);
  }
  $http.get(apiUrl + '/tags').success(function(data, status) {
    dime.tags = data;
    done(dime.tags);
  });
}

function getTimeslices($http, done) {
  if (dime.timeslices) {
    return done(dime.timeslices);
  }
  $http.get(apiUrl + '/timeslices').success(function(data, status) {
    dime.timeslices = data;
    done(dime.timeslices);
  });
}

function loadData($scope, $http) {
  getActivities($http, function (activities, status) {
    //$scope.handleLogin(status);
    $scope.activities = activities;
  });
  getTimeslices($http, function (timeslices, status) {
    //$scope.handleLogin(status);
    $scope.timeslices = timeslices;
  });
  getCustomers($http, function (customers, status) {
    //$scope.handleLogin(status);
    $scope.customers = customers;
  });
  getProjects($http, function (projects, status) {
    //$scope.handleLogin(status);
    $scope.projects = projects;
  });
  getServices($http, function (services, status) {
    //$scope.handleLogin(status);
    $scope.services = services;
  });
  getTags($http, function (tags, status) {
    //$scope.handleLogin(status);
    $scope.tags = tags;
  });
}

var BaseCtrl = function BaseCtrl($scope, $http) {
  loadData($scope, $http);
  $scope.filter = {};
};
BaseCtrl.$inject = ['$scope', '$http'];
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
