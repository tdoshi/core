var dependencies = [
  'ngRoute',
  'mgcrea.ngStrap',
  'ui.slider',
  'ytann.services'
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
    when('/profile/:id', {
      templateUrl: '/partials/user.html',
      controller: 'UserCtrl'
    }).
    when('/create', {
      templateUrl: '/partials/create.html',
      controller: 'CreateCtrl'
    }).
    when('/consume/:id', {
      templateUrl: '/partials/consume.html',
      controller: 'ConsumeCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);
