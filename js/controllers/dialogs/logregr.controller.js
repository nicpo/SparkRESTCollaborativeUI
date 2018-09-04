app.controller('LogRegrCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', function ($scope, Statistics, $modalInstance, selectedItem, Utils) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);
    $scope.depVars = selectedItem.headers;
    $scope.depVar = selectedItem.headers[0];
    $scope.selectedItem = selectedItem;
    $scope.name = 'Logistic Regression on ' + selectedItem.name;

    var applyDefaults = function () {
        $scope.iterations = 100;
        $scope.showIterationsError = false;
        $scope.trainingSizeError = false;
        $scope.showColumnsError = false;
        $scope.regularizationParameterError = false;
        $scope.regularizationTypes = [
            {name: 'None', id: 'none'},
            {name: 'L1', id: 'L1'},
            {name: 'L2', id: 'L2'}
        ];
        $scope.regularizationType = $scope.regularizationTypes[0];
        $scope.regularizationParameter = 0.0;
        $scope.trainingSize = 0.6;
    };

    applyDefaults();

    var validate = Utils.validate;

    var submitAttempted = false;
    var applyValidation = function () {
        if (!submitAttempted)
            return;
        $scope.showIterationsError = !validate.gtZeroEm($scope.iterations);
        $scope.showColumnsError = Utils.analysis.checkedCols($scope.columns).length == 0;
        $scope.trainingSizeError = !validate.fitTrainingSize($scope.trainingSize);
        $scope.regularizationParameterError = ($scope.regularizationType.id != 'none') ? !validate.fitRegParameter($scope.regularizationParameter) : false;


        return $scope.regularizationParameterError || $scope.showColumnsError || $scope.showIterationsError || $scope.trainingSizeError;
    };

    $scope.setSelectedOption = function (option) {
        $scope.regularizationType = option;
    };

    $scope.$watchGroup(['iterations', 'regularizationType', 'trainingSize', 'regularizationParameter'], function () {
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

        $scope.query = 'SELECT ' + $scope.depVar + ', ' + Utils.analysis.checkedColsToStr($scope.columns) + ' FROM ' + selectedItem.table;

        $scope.inProgress = true;


        Statistics.logisticRegression($scope).then(function () {
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