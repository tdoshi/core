var CreateCtrl = function($scope, $http, $window, $interval, $timeout, UserService, youtubePlayerApi) {
  // The whole annotation, which includes many individual annotations
  $scope.whole = {
  	video_link: "https://www.youtube.com/watch?v=UA0wb6E3hyg",
  	video_id: "UA0wb6E3hyg",
  	title: "placeholder",
  	duration: 197
  };
  $scope.error = "";
  $scope.videoDim = {
  	height: 340,
  	width: 600
  };
  $scope.visualAnnStyle = {
  	width: $scope.videoDim.width + 'px',
  	'background-color': '#F9F9F9'
  };

  UserService.
    getCurrentUser().
    success(function(data) { console.log(data); $scope.user = data.user; }).
    error(function() { $scope.user = null; });

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

  VideoStatusEnum = Object.freeze({
  	UNSTARTED: -1,
  	ENDED: 0,
  	PLAYING: 1,
  	PAUSED: 2,
  	BUFFERING: 3,
  	VIDEO_CUED: 5
  });
	
  $scope.getVideoData = function(video_id) {
    $http.get("/queryyt/" + $scope.whole.video_id).success(function(data) {
      console.log(data);
      var vidTitle = data.items[0].snippet.title
      console.log($scope.user);
      if ($scope.user) {        
        if (vidTitle.length > 45) {
          $scope.whole.title = $scope.user.first_name + " on '" + vidTitle.substring(0, 35) + "...'";
        } else {
          $scope.whole.title = $scope.user.first_name + " on '" + vidTitle + "'";
        }
      } else {
        $scope.whole.title = vidTitle;
      }
      
      // PT3M18S or PT1H27M5S
      var durationStr = data.items[0].contentDetails.duration;
      $scope.whole.duration = youtubePlayerApi.getDuration(durationStr);
      console.log($scope.whole.duration);
    });
  };

  $scope.init = function() {
    youtubePlayerApi.bindVideoPlayer('ytplayer');
    $scope.$on('apiReady',function () {
      $scope.player = youtubePlayerApi.loadPlayer($scope.whole.video_id);
    });
    if ($scope.whole.video_id) $scope.getVideoData($scope.whole.video_id);
  };
  $scope.init();

  $scope.loadVideo = function() {
  	var re = /v=([\w-]+)/;
  	var matched = $scope.whole.video_link.match(re);
  	if (matched.length != 2) {
  		$scope.error = 'failed to parse the youtube link';
  		// TODO: better error checking here
  		return;
  	}
  	// All Youtube video ids are 11 characters
  	if (matched[1].length != 11) {
  		$scope.error = 'that is not a valid Youtube ID'
  		return;
  	}
  	$scope.whole.video_id = matched[1];
    // Reset 
    $scope.annotations = [];
    $scope.player = youtubePlayerApi.loadPlayer($scope.whole.video_id);
    $scope.getVideoData($scope.whole.video_id);
  };

  // Allow user to create an individual annotation
  $scope.annotate = function() {
  	var state = $scope.player.getPlayerState();
  	// TODO: robust casework, e.g. what about buffering?
  	if (state == VideoStatusEnum.PLAYING) {
  		$scope.allowAnnotation = true;
  		$scope.player.pauseVideo();
  		$scope.curAnn.start_time = Math.floor($scope.player.getCurrentTime());
  	} else if (state == VideoStatusEnum.PAUSED || state == VideoStatusEnum.UNSTARTED || state == VideoStatusEnum.VIDEO_CUED || state == VideoStatusEnum.ENDED) {
  		$scope.player.playVideo();
  	}
  };

  // Add individual annotation to list of annotations
  $scope.completeAnnotation = function() {
  	$scope.allowAnnotation = false;
  	// $scope.annotations.push($scope.curAnn);
  	var insertionInd = locationOf($scope.curAnn, $scope.annotations);
  	$scope.annotations.splice(insertionInd, 0, $scope.curAnn);
  	$scope.curAnn = {
  		duration: 5,
  		content: ''
  	};
		console.log('list of annotations', $scope.annotations);
  	$scope.player.playVideo();
  };

  // Really need tests
  // http://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
  locationOf = function(elem, arr, start, end) {
  	if (arr.length == 0) return 0;
  	var start = start || 0;
  	var end = end || arr.length;
  	var pivot = parseInt((end + start) / 2, 10);
  	if (arr[pivot].start_time == elem.start_time) return pivot;
  	if (end - start <= 1) {
  		if (arr[pivot].start_time > elem.start_time) {
  			return pivot;
  		} else {
  			return pivot + 1;
  		} 
  	}
  	if (arr[pivot].start_time < elem.start_time) {
	    return locationOf(elem, arr, pivot, end);
	  } else {
	    return locationOf(elem, arr, start, pivot);
	  }
  };

  $scope.deleteAnn = function(ind) {
  	$scope.annotations.splice(ind, 1);
  };

  $scope.exit = function() {
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
  	$scope.whole.annotations = $scope.annotations;
  	var data = {annotationWhole: $scope.whole}
  	$http.post('/create', data).
  		success(function(data) {
        if (data.user == null) $window.location = "/splash";
  			console.log("Got data back!", data);
  		}).error(function(err) {
  			console.log('unable to save this to your profile', err);
  		});
  };

  $scope.makeSingleVisualAnn = function(ann) {
  	var annWidth = ann.duration / $scope.whole.duration * $scope.videoDim.width;
  	var annLeft = ann.start_time / $scope.whole.duration * $scope.videoDim.width;
  	// both annLeft and annWidth should be a fraction, less than 1
    return {
	  	width: annWidth + 'px',
	  	left: annLeft + 'px'
	  };
  }
};

CreateCtrl.$inject = ['$scope', '$http', '$window', '$interval', '$timeout', 'UserService', 'youtubePlayerApi'];

