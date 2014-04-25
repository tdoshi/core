var CreateCtrl = function($scope, $http, $window, $interval) {
  // The whole annotation, which includes many individual annotations
  $scope.whole = {
  	video_link: "https://www.youtube.com/watch?v=7IoRIj9XQfQ",
  	video_id: "7IoRIj9XQfQ"
  };
  $scope.player = {};
  $scope.error = "";
  $scope.youtubeLoaded = false;
  $scope.curAnn = {
  	duration: 5
  };
  $scope.playText = "Play snippet";

  $scope.annotations = [];
  // $scope.allowAnnotation = false;
  $scope.allowAnnotation = true;
  // TODO: make this frozen so it cannot be changed
  VideoStatusEnum = Object.freeze({
  	UNSTARTED: -1,
  	ENDED: 0,
  	PLAYING: 1,
  	PAUSED: 2,
  	BUFFERING: 3,
  	VIDEO_CUED: 5
  });

  $scope.loadVideo = function(youtubeLink) {
  	var re = /v=([\w-]+)/;
  	var matched = $scope.whole.video_link.match(re);
  	if (matched.length != 2) {
  		$scope.error = 'failed to parse the youtube link';
  		console.log($scope.error);
  		// TODO: better error checking here
  		return;
  	}
  	// All Youtube video ids are 11 characters
  	if (matched[1].length != 11) {
  		// TODO: better error checking here
  		$scope.error = 'that is not a valid Youtube ID'
  		return;
  	}
  	$scope.whole.video_id = matched[1];
  	console.log($scope.whole.video_id);
  	if ($scope.youtubeLoaded) {
  		$scope.player = new YT.Player('ytplayer', {
	      height: '390',
	      width: '640',
	      videoId: $scope.whole.video_id
	    });
  	}
  };

  $scope.annotate = function() {
  	var state = $scope.player.getPlayerState();
  	// TODO: robust casework, what about buffering?
  	if (state == VideoStatusEnum.PLAYING) {
  		$scope.allowAnnotation = true;
  		$scope.player.pauseVideo();
  		$scope.curAnn.time = Math.floor($scope.player.getCurrentTime());
  	} else if (state == VideoStatusEnum.PAUSED || state == VideoStatusEnum.UNSTARTED || state == VideoStatusEnum.VIDEO_CUED || state == VideoStatusEnum.ENDED) {
  		$scope.player.playVideo();
  	}
  };

  $scope.completeAnnotation = function() {
  	$scope.allowAnnotation = false;
  	$scope.annotations.push($scope.curAnn);
  	$scope.curAnn = {};
		console.log('hi', $scope.annotations);
  	$scope.player.playVideo();
  };

  $scope.examineAnn = function(ann) {
  	console.log('time of ann:', ann.time);
  	$scope.player.seekTo(ann.time);
  };

  $scope.playSnippet = function() {
  	$scope.player.seekTo($scope.curAnn.time);
  	$scope.player.playVideo();
  	$scope.playText = "Playing...";
  	function update() {
  		var curTime = $scope.player.getCurrentTime();
  		if (curTime > $scope.curAnn.time + $scope.curAnn.duration) {
  			$scope.playText = "Play snippet";
  			$scope.player.pauseVideo();
  			clearInterval(interval);
  			$interval.cancel(interval);
  		}
  	}
  	var interval = $interval(update, 1000);
  	
  	$scope.$on("$destroy", function(e) {
  		$interval.cancel(update);
  	});
  };


  // This gets called once the Youtube iframe API code has loaded
  $window.onYouTubeIframeAPIReady = function() {
  	$scope.youtubeLoaded = true;
  	$scope.loadVideo();
  	console.log('loaded yt player API');
  };
};

CreateCtrl.$inject = ['$scope', '$http', '$window', '$interval'];

