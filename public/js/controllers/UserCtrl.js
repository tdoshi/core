var UserCtrl = function($scope, $http, $routeParams) {
	$scope.user = {};
	$scope.annList = [];

  $http.get('/user/' + $routeParams.id).success(function(data) {
  	$scope.user = data.user;
  	$scope.annList = data.annList;
  	console.log($scope.annList);
  });
};

UserCtrl.$inject = ['$scope', '$http', '$routeParams'];
