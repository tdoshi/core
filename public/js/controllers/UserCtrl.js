var UserCtrl = function($scope, $http, $routeParams, $window) {
	$scope.user = {};
	$scope.annList = [];

  $http.get('/profile/' + $routeParams.id).success(function(data) {
  	if (data.user == null) $window.location = "/splash";
  	$scope.user = data.user;
  	$scope.annList = data.annList;
  	console.log($scope.annList);
  });
};

UserCtrl.$inject = ['$scope', '$http', '$routeParams', '$window'];
