app.controller('LRegrCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', function ($scope, Statistics, $modalInstance, selectedItem, Utils) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);
    $scope.selectedItem = selectedItem;
    $scope.name = 'Linear Regression on ' + selectedItem.name;

    var applyDefaults = function () {
        $scope.iterations = 100;
        $scope.showIterationsError = false;
        $scope.showColumnsError = false;
    };

    applyDefaults();

    var validate = Utils.validate;

    var submitAttempted = false;
    var applyValidation = function () {
        if (!submitAttempted)
            return;
        $scope.showIterationsError = !validate.gtZeroEm($scope.iterations);
        $scope.showColumnsError = Utils.analysis.checkedCols($scope.columns).length == 0;

        return $scope.showColumnsError || $scope.showIterationsError;
    };

    $scope.$watchGroup(['iterations'], function () {
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
        Statistics.linearRegression($scope).then(function () {
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