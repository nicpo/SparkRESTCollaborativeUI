app.controller('SVMCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', function ($scope, Statistics, $modalInstance, selectedItem, Utils) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);
    $scope.selectedItem = selectedItem;
    $scope.name = 'SVM on ' + selectedItem.name;

    var applyDefaults = function () {
        $scope.iterations = 100;
        $scope.showIterationsError = false;
        $scope.trainingSizeError = false;
        $scope.showColumnsError = false;
        $scope.regularizationParameterError = false;
        $scope.miniBatchFractionError = false;
        $scope.stepSizeError = false;
        $scope.regularizationTypes = [
            {name: 'None', id: 'none'},
            {name: 'L1', id: 'L1'},
            {name: 'L2', id: 'L2'}
        ];
        $scope.regularizationType = $scope.regularizationTypes[0];
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

        $scope.miniBatchFractionError = !validate.fitMiniBatchFraction($scope.miniBatchFraction);
        $scope.stepSizeError  = !validate.fitStepSize($scope.stepSize);

        return $scope.miniBatchFractionError || $scope.stepSizeError || $scope.regularizationParameterError
            || $scope.showColumnsError || $scope.showIterationsError || $scope.trainingSizeError;
    };

    $scope.setSelectedOption = function (option) {
        $scope.regularizationType = option;
    };

    $scope.$watchGroup(['iterations', 'regularizationType',
        'trainingSize', 'regularizationParameter', 'miniBatchFraction', 'stepSize'], function () {
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


        Statistics.svm($scope).then(function () {
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