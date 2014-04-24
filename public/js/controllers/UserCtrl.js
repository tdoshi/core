

var UserCtrl = function($scope, $http) {
	$scope.my_var = 'helo';

  console.log('getting a single user');

  $scope.runThis = function() {
  	$scope.my_var = "yayayayay";
  	console.log("button clikced");
  };

};

UserCtrl.$inject = ['$scope', '$http'];
