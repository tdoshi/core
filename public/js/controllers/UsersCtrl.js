var UsersCtrl = function($scope, $http) {
  $scope.users = [];

  console.log('getting all users');
  $http.get('/users').success(function(users) {
  	console.log(users);
  	$scope.users = users;
  })
};

UsersCtrl.$inject = ['$scope', '$http'];
