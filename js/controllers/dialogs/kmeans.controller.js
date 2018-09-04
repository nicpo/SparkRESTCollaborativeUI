app.controller('KMeansCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', function ($scope, Statistics, $modalInstance, selectedItem, Utils) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);
    $scope.selectedItem = selectedItem;
    $scope.name = 'K-Means Clustering on ' + selectedItem.name;

    var applyDefaults = function () {
        $scope.iterations = 20;
        $scope.runs = 1;
        $scope.clustersError = false;
        $scope.showIterationsError = false;
        $scope.showRunsError = false;
        $scope.showColumnsError = false;
    };

    applyDefaults();

    var validate = Utils.validate;

    var submitAttempted = false;
    var applyValidation = function () {
        if (!submitAttempted)
             return;
        $scope.clustersError = !validate.gtZero($scope.clusters);
        $scope.showIterationsError = !validate.gtZeroEm($scope.iterations);
        $scope.showRunsError = !validate.gtZeroEm($scope.runs);
        $scope.showColumnsError = Utils.analysis.checkedCols($scope.columns).length == 0;

        return $scope.showColumnsError  || $scope.clustersError || $scope.showIterationsError || $scope.showRunsError;
    };

    $scope.$watchGroup(['clusters', 'iterations', 'runs'], function () {
        applyValidation();
    });

    $scope.$watch('columns', function () {
        applyValidation();
    }, true);


    $scope.onConfirmClick = function () {
        submitAttempted = true;
        var isInValid = applyValidation();
        if (isInValid)
            return;

        $scope.query = 'SELECT ' + Utils.analysis.checkedColsToStr($scope.columns) + ' FROM ' + selectedItem.table;

        $scope.inProgress = true;
        Statistics.kmeans($scope).then(function () {
            $modalInstance.dismiss();
        }).catch(function () {
            //todo raise and handle exceptions
        }).finally(function () {
            $scope.inProgress = false;
        });
    };


    $scope.onCancelClick = function () {
        $modalInstance.dismiss();
    };

}]);