app.controller('FilterCtrl', ['$scope', '$rootScope', 'Datasets', 'Info', 'Query', 'headers', function ($scope, $rootScope, Datasets, Info, Query, headers) {

    // build query through UI or SQL
    $scope.type = 'UI';

    $scope.headers = headers;
    $scope.header = headers[0];

    $scope.functions = Query.getFunctions();
    $scope.queryFunction = $scope.functions[0];
    $scope.queryPredicate = '=';

    $scope.applyFilter = function () {
        var query = $scope.query;
        if ($scope.type === 'UI') {
            query = Query.build($scope.queryFunction, {
                columnName: $scope.header,
                predicate: $scope.queryPredicate,
                literal: $scope.queryLiteral
            });
        }            

        $rootScope.$broadcast('filterAdded', query);
        $scope.$close();
    };
}]);