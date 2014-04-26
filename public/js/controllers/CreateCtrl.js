var CreateCtrl = function($scope, $http, $window, $interval, YoutubeAPILoaded) {
  // The whole annotation, which includes many individual annotations
  $scope.whole = {
  	video_link: "https://www.youtube.com/watch?v=UA0wb6E3hyg",
  	video_id: "UA0wb6E3hyg",
  	title: "placeholder",
  	duration: 100
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
	
  $scope.loadVideo = function() {
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
  	// Reset 
  	// $scope.annotations = [];

  	console.log('checking to see if we can load iframe', YoutubeAPILoaded.sharedObject.youtubeLoaded);
  	if (YoutubeAPILoaded.sharedObject.youtubeLoaded) {
  		console.log('should recreate new player now');
  		if ($scope.player != undefined) $scope.player.destroy();
  		$scope.player = new YT.Player('ytplayer', {
	      height: $scope.videoDim.height,
	      width: $scope.videoDim.width,
	      videoId: $scope.whole.video_id,
	      events: {
	      	'onReady': onPlayerReady
	      }
	    });
  		console.log('duration is', $scope.player);
	    $scope.whole.duration = $scope.player.getDuration();
  		$http.get("/queryyt/" + $scope.whole.video_id).success(function(data) {
  				var vidTitle = data.items[0].snippet.title
  				$scope.whole.title = vidTitle;
     });

  	}
  };

  onPlayerReady = function(event) {
  	console.log('the player has loaded');
  	console.log($scope.player.getDuration());
  }

  // All variables are reset when this controller starts again (clicking on the tab), so we attempt to auto load the iframe if possible 
  if ($scope.whole.video_link) {
  	$scope.loadVideo();	
  }
  

  // Allow user to create an individual annotation
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
  	$scope.whole.annotations = $scope.annotations;
  	var data = {annotationWhole: $scope.whole}
  	$http.post('/create', data).
  		success(function(data) {
  			console.log("Got data back!", data);
  		}).error(function(err) {
  			console.log('unable to save this to your profile', err);
  		});
  };

  $scope.makeSingleVisualAnn = function(ann) {
  	// $scope.$watch( "player" , function(newValue, oldValue) {
  	// 	console.log('watched value of scope.player');
  	// 	console.log(newValue);
  	// 	console.log($scope.player);
  	// });
  	// console.log('yes!!!!', ann, $scope.whole.duration);  	
  	var annWidth = ann.duration / 198 * $scope.videoDim.width;
  	var annLeft = ann.start_time / 198 * $scope.videoDim.width;
  	return {
	  	border: '2px solid',
	  	top: '6px',
	  	position: 'absolute',
	  	width: annWidth + 'px',
	  	left: annLeft + 'px',
	  	height: '10px',
	  	cursor: 'pointer',
	  	'border-radius': '2px',
	  	'background-color': 'green'
	  };
  }

  // This gets called once the Youtube iframe API code has loaded
  $window.onYouTubeIframeAPIReady = function() {
  	// $scope.youtubeLoaded = true;
  	YoutubeAPILoaded.sharedObject.youtubeLoaded = true;
  	$scope.loadVideo();
  	console.log('loaded yt player API');
  };
};

CreateCtrl.$inject = ['$scope', '$http', '$window', '$interval', 'YoutubeAPILoaded'];

