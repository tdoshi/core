angular.module('ytann.services', ['ng'])
	.service('youtubePlayerApi', ['$window', '$rootScope', function ($window, $rootScope) {
    var service = $rootScope.$new(true);

    // Youtube callback when API is ready
    window.onYouTubeIframeAPIReady = function() {
      console.log('Youtube API is ready');
      $rootScope.$broadcast('apiReady');
    };

    service.playerId = null;
    service.player = null;
    service.videoId = null;
    service.playerHeight = '340';
    service.playerWidth = '600';

    service.bindVideoPlayer = function(elementId) {
      service.playerId = elementId;
    };

    service.createPlayer = function() {
      console.log('Creating a new Youtube player for DOM id ' + this.playerId + ' and video ' + this.videoId);
      return new YT.Player(this.playerId, {
        height: this.playerHeight,
        width: this.playerWidth,
        videoId: this.videoId
      });
    };

    // Assume the iframe api is loaded
    service.loadPlayer = function(videoId) {
    	this.videoId = videoId;
      if (this.playerId && this.videoId) {
        if(this.player) this.player.destroy();
        this.player = this.createPlayer();
      }
      return this.player;
    };

    // input PT3M18S or PT1H27M5S
    // output number of seconds in video
    service.getDuration = function(durationStr) {
    	formatted = durationStr.substring(2)
    	hmsParse = formatted.match(/(\d+)H(\d+)M(\d+)S/)
    	if (hmsParse) {
    		var hours = parseInt(hmsParse[1]);
    		var minutes = parseInt(hmsParse[2]);
    		var seconds = parseInt(hmsParse[3]);
    		return hours*3600 + minutes*60 + seconds;
    	} else {
    		msParse = formatted.match(/(\d+)M(\d+)S/)
    		if (msParse) {
    			var minutes = parseInt(msParse[1]);
	    		var seconds = parseInt(msParse[2]);
	    		return minutes*60 + seconds;	
    		} else {
    			sParse = formatted.match(/(\d+)S/)
    			var seconds = parseInt(msParse[1]);
    			return seconds;
    		}    		
    	}
    };

    return service;
  }])
  .factory('UserService', ['$http', function($http) {
    return {
      // usage: getCurrentUser().success(successCallback).error(errorCallback)
      getCurrentUser: function() {
        return $http.get('/profile/me');
      }
    }
  }])
  .service;