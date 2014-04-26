angular.module('ytann.services', ['ng'])
  .factory('YoutubeAPILoaded', ['$http', function($http) {
    return {
      sharedObject: {youtubeLoaded: false}
    }
  }]);