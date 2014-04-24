var AnnCtrl = function($scope, $http, $window) {
  // The whole annotation, which includes many individual annotations
  $scope.whole = {
  	video_link: "https://www.youtube.com/watch?v=7IoRIj9XQfQ",
  	video_id: ""
  };
  $scope.player = {};
  $scope.error = "";
  $scope.youtubeLoaded = false;

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

  // This gets called once the Youtube iframe API code has loaded
  $window.onYouTubeIframeAPIReady = function() {
  	$scope.youtubeLoaded = true;
  	console.log('loaded yt player API');
  }

};

AnnCtrl.$inject = ['$scope', '$http', '$window'];

