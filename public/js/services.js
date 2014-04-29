angular.module('ytann.services', ['ng'])
  .factory('YoutubeAPILoaded', ['$window', function($window) {
    // $window.alert('alerted!!');
    return {
      sharedObject: {youtubeLoaded: false}
    }
  }])
  .factory('UserService', ['$http', function($http) {
    return {
      // usage: getCurrentUser().success(successCallback).error(errorCallback)
      getCurrentUser: function() {
        return $http.get('/profile/me');
      }
    }
  }]);