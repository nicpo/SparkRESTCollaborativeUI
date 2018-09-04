app.controller('MainCtrl', ['$scope', '$rootScope', 'Message', function ($scope, $rootScope, Message) {

    $rootScope.prompts =  Message.prompts;
    $scope.startupComplete = true;

    $scope.$on('startingUp', function () {
        $scope.startupComplete = false;
    });
    $scope.$on('startedUp', function () {
        $scope.startupComplete = true;
    });
    $scope.showSidebar = false;
    $scope.$on('infoPanelEvent', function (event, data) {
        $scope.showSidebar = data.show;
    });


    console.log('MainCtrl');

}]);