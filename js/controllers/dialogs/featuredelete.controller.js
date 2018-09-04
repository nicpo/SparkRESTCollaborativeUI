app.controller('FeatureDeleteCtrl', ['$scope', '$rootScope', 'Query', 'Utils', 'features', function ($scope, $rootScope, Query, Utils, features) {

    $scope.columns = features;

    $scope.onConfirmClick = function () {
        $rootScope.$broadcast('featuresDeleted', $scope.columns);
        $scope.$close();
    };
}]);