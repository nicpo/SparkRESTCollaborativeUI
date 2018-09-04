app.controller('RForestCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', function ($scope, Statistics, $modalInstance, selectedItem, Utils) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);
    $scope.depVars = selectedItem.headers;
    $scope.depVar = selectedItem.headers[0];
    $scope.selectedItem = selectedItem;
    $scope.name = 'Decision Tree on ' + selectedItem.name;

    var applyDefaults = function () {
        $scope.algos = [
            {name: 'regression', id: 'regression'},
            {name: 'classification', id: 'classification'}
        ];
        $scope.algo = $scope.algos[0];
        $scope.numClasses = 0;
        $scope.categoricalFeaturesInfo = [
            {feature:'0', numCategories:'0'}
        ];
        $scope.impurity = 'variance';
        $scope.maxDepth = 5;
        //$scope.minInstancesPerNode = 5;
        //$scope.minInfoGain = 0.1;
        $scope.maxBins = 32;
        $scope.numTrees = 10;
        $scope.subsamplingRate = 1;
        $scope.featureSubsetStrategy = 'auto';
        $scope.trainingSize = 0.6;
    };

    applyDefaults();

    var validate = Utils.validate;

    var submitAttempted = false;
    var applyValidation = function () {
        if (!submitAttempted)
            return;
        // todo: add proper validation, also of other params
        $scope.maxDepthError = !validate.gtZeroEm($scope.maxDepth);
        $scope.minInfoGainError = !validate.fitTrainingSize($scope.minInfoGain);

        $scope.algoError = ($scope.algo.id === 'regression') ? ($scope.impurity != 'variance') : true;
        if(!$scope.algoError)
            $scope.algoError = ($scope.algo.id === 'classification') ? (($scope.impurity != 'gini') && ($scope.impurity != 'entropy')) : true;

        return $scope.maxDepthErorr || $scope.minInfoGainError || $scope.algoError;
    };

    $scope.setSelectedOption = function (option) {
        $scope.algo = option;
    };

    $scope.$watchGroup(['maxDepth', 'algo', 'minInfoGain'], function () {
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


        Statistics.decisionTree($scope).then(function () {
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