var dependencies = [
  'ngRoute',
  'mgcrea.ngStrap'
];

angular.module('app', dependencies).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/partials/home.html',
      controller: 'HomeCtrl'
    }).
    when('/users', {
      templateUrl: '/partials/users.html',
      controller: 'UsersCtrl'
    }).
    when('/user/:id', {
      templateUrl: '/partials/user.html',
      controller: 'UserCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);
