var AnnCtrl = function($scope, $http) {
  // The whole annotation, which includes many individual annotations
  $scope.whole = {
  	video_link: "https://www.youtube.com/watch?v=7IoRIj9XQfQ",
  	video_id: ""
  };
  $scope.error = "";

  // Load the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $scope.loadVideo = function(youtubeLink) {
  	var re = /v=([\w-]+)/;
  	var matched = $scope.whole.video_link.match(re);
  	if (matched.length != 2) {
  		$scope.error = 'failed to parse the youtube link';
  		console.log($scope.error);
  		return;
  	}
  	$scope.whole.video_id = matched[1];
  	console.log($scope.whole.video_id);
		// Replace the 'ytplayer' element with an <iframe> and
	  // YouTube player after the API code downloads.
	  var player;
	  console.log("player", player);
	  function onYouTubePlayerAPIReady() {
	  	console.log('loaded yt player API');
	    player = new YT.Player('ytplayer', {
	      height: '390',
	      width: '640',
	      videoId: 'M7lc1UVf-VE'
	    });
	  }

  };

};

AnnCtrl.$inject = ['$scope', '$http'];

