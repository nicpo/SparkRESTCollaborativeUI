app.controller('LoginCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {


    $scope.loading = false;

    $scope.login = function () {
        $scope.$broadcast('show-errors-check-validity');
        if (!$scope.userForm.$valid) {
            return;
        }
        $scope.loading = true;
        $scope.message = "";

        Auth.startUpCommand({clean:true, username:$scope.username, password:$scope.password}).then(function (response) {
            $location.path('dashboard');
        }).catch(function (message) {
            $scope.message = message;
        }).finally(function () {
            $scope.loading = false;
        });
    };
}]);