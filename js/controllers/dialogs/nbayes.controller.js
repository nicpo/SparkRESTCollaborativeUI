app.controller('NBayesCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', function ($scope, Statistics, $modalInstance, selectedItem, Utils) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);
    $scope.depVars = selectedItem.headers;
    $scope.depVar = selectedItem.headers[0];
    $scope.selectedItem = selectedItem;
    $scope.name = 'Naive Bayes on ' + selectedItem.name;

    var applyDefaults = function () {
        $scope.trainingSizeError = false;
        $scope.showColumnsError = false;
        $scope.lambda = 1.0;
    };

    applyDefaults();

    var validate = Utils.validate;

    var submitAttempted = false;
    var applyValidation = function () {
        if (!submitAttempted)
            return;
        $scope.showColumnsError = Utils.analysis.checkedCols($scope.columns).length == 0;
        $scope.trainingSizeError = !validate.fitTrainingSize($scope.trainingSize);
        $scope.lambdaError = !validate.fitTrainingSize($scope.lambda);


        return $scope.showColumnsError || $scope.showLambdaError || $scope.trainingSizeError;
    };

    $scope.$watchGroup(['lambda', 'trainingSize'], function () {
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


        Statistics.naiveBayes($scope).then(function () {
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