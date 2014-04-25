var CreateCtrl = function($scope, $http, $window, $interval) {
  // The whole annotation, which includes many individual annotations
  $scope.whole = {
  	video_link: "https://www.youtube.com/watch?v=7IoRIj9XQfQ",
  	video_id: "7IoRIj9XQfQ"
  };
  $scope.error = "";
  $scope.youtubeLoaded = false;
  
  // $scope.annotations = [];
  $scope.annotations = [
  	{	content: "lovely",
  		duration: 5,
  		start_time: 30	
  	},
  	{	content: "even nicer",
  		duration: 8,
  		start_time: 44	
  	},
  	{	content: "my fav",
  		duration: 0,
  		start_time: 58
  	},
  ];
  $scope.curAnn = {
  	duration: 5,
  	content: ''
  };
  $scope.playText = "Play snippet";
  $scope.allowAnnotation = false;
  // $scope.allowAnnotation = true;
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
  		$scope.curAnn.start_time = Math.floor($scope.player.getCurrentTime());
  	} else if (state == VideoStatusEnum.PAUSED || state == VideoStatusEnum.UNSTARTED || state == VideoStatusEnum.VIDEO_CUED || state == VideoStatusEnum.ENDED) {
  		$scope.player.playVideo();
  	}
  };

  $scope.completeAnnotation = function() {
  	$scope.allowAnnotation = false;
  	$scope.annotations.push($scope.curAnn);
  	$scope.curAnn = {
  		duration: 5,
  		content: ''
  	};
		console.log('list of annotations', $scope.annotations);
  	$scope.player.playVideo();
  };

  $scope.exit = function() {
  	console.log('yet another function');
  	$scope.allowAnnotation = false;
  };

  $scope.playSnippet = function(ann) {
  	console.log('playing snippet starting at:', ann.start_time);
  	$scope.player.seekTo(ann.start_time);
  	$scope.player.playVideo();
  	$scope.playText = "Playing...";
  	function update() {
  		var curTime = $scope.player.getCurrentTime();
  		if (curTime > ann.start_time + ann.duration) {
  			$scope.playText = "Play snippet";
  			$scope.player.pauseVideo();
  			$interval.cancel(interval);
  		}
  	}
  	var interval = $interval(update, 1000);
  	
  	$scope.$on("$destroy", function(e) {
  		$interval.cancel(update);
  	});
  };

  $scope.publish = function() {
  	console.log('going to publish these annotations!');
  	// TODO: allow option for public or unlisted
  	$scope.whole.privacy = 'public';
  	// TODO: allow user to give title
  	$scope.whole.title = 'My placeholder title';
  	$scope.whole.annotations = $scope.annotations;
  	var data = {annotationWhole: $scope.whole}
  	$http.post('/create', data).
  		success(function(data) {
  			console.log("Got data back!", data);
  		}).error(function(err) {
  			console.log('unable to save this to your profile', err);
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

