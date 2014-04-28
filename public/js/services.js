angular.module('ytann.services', ['ng'])
  .factory('YoutubeAPILoaded', ['$http', function($http) {
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