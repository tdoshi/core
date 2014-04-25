var ConsumeCtrl = function($scope, $http, $routeParams) {
	$scope.whole = {};

  $http.get('/consume/' + $routeParams.id).success(function(data) {
  	console.log("got back data", data);
		$scope.whole = data;
  });
};

ConsumeCtrl.$inject = ['$scope', '$http', '$routeParams'];
