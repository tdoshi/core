var UserCtrl = function($scope, $http, $routeParams) {
	$scope.user = {};

  $http.get('/user/'+$routeParams.id).success(function(user) {
  	if (!user) console.log("null user");
  	$scope.user = user;
  });
};

UserCtrl.$inject = ['$scope', '$http', '$routeParams'];
