app.controller('FeatureCtrl', ['$scope', '$rootScope', 'Query', 'headers', function ($scope, $rootScope, Query, headers) {

    // build query through UI or SQL
    $scope.type = 'UI';

    $scope.headers = headers;
    $scope.header = headers[0];

    $scope.functions = Query.getFeatureFunctions();
    $scope.queryFunction = $scope.functions[0];

    $scope.applyFeature = function () {
        var query = $scope.query;
        if ($scope.type === 'UI') {
            query = Query.build($scope.queryFunction, {
                columnName: $scope.header,
                literal: $scope.queryLiteral
            });
        }

        $rootScope.$broadcast('featureAdded', {
            query: query,
            name: $scope.featureName
        });
        $scope.$close();
    };
}]);