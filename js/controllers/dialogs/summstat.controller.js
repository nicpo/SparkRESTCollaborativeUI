app.controller('SumStatCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', function ($scope, Statistics, $modalInstance, selectedItem, Utils) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);

    $scope.selectedItem = selectedItem;
    $scope.name = 'Summary Statistic on ' + selectedItem.name;

    var applyDefaults = function () {
        $scope.showColumnsError = false;
    };

    applyDefaults();

    var submitAttempted = false;
    var applyValidation = function () {
        if (!submitAttempted)
            return;
        $scope.showColumnsError = Utils.analysis.checkedCols($scope.columns).length == 0;

        return !$scope.showColumnsError;
    };

    $scope.$watch('columns', function () {
        applyValidation();
    }, true);

    $scope.onConfirmClick = function () {
        submitAttempted = true;
        var isValid = applyValidation();
        if (!isValid)
            return;

        $scope.query = 'SELECT ' + Utils.analysis.checkedColsToStr($scope.columns) + ' FROM ' + selectedItem.table;

        $scope.inProgress = true;
        Statistics.summary($scope).then(function () {
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