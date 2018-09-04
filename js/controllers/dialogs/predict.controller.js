app.controller('PredictionCtrl', ['$scope', 'Statistics', '$modalInstance', 'selectedItem', 'Utils', 'Analyses', function ($scope, Statistics, $modalInstance, selectedItem, Utils, Analyses) {

    $scope.columns = Utils.analysis.headersToCols(selectedItem.headers);
    var analysis = [];

    $scope.selectedItem = selectedItem;
    $scope.name = 'Predict on ' + selectedItem.name;
    var types = Analyses.getPredictTypes();


    var applyDefaults = function () {
        $scope.types = types;
        $scope.type = types[0];
        $scope.analys = null;
        $scope.datasetName = "";
    };


    applyDefaults();
    var submitAttempted = false;
    var applyValidation = function () {
        if (!submitAttempted)
            return;
        $scope.showAnalysisError =  $scope.analys == null;
        $scope.showNameError =  $scope.datasetName.length == 0;

        return !($scope.showAnalysisError || $scope.showColumnsError);
    };

    $scope.$watchGroup(['analys', 'datasetName'], function () {
        applyValidation();
    });

    $scope.loadingState = true;

    $scope.setSelectedType = function (option) {
        $scope.type = option;
        $scope.analysis = analysis.filter(function (item) {
            return option.statType === 'all' || item.statType === option.statType;
        });

        // reset selection
        if ($scope.analysis.indexOf($scope.analys) === -1) {
            $scope.analys = null;
        }
    };

    $scope.setSelectedOption = function (option) {
        $scope.analys = option;
    };

    Analyses.getForPredict().then(function (data) {
        $scope.analysis = analysis = data;
    }).finally(function () {
        $scope.loadingState = false;
    });



    $scope.$watch('columns', function () {
        applyValidation();
    }, true);

    $scope.onConfirmClick = function () {
        submitAttempted = true;
        var isValid = applyValidation();
        if (!isValid)
            return;

        var restUrl;
        for (var i = 0; i < types.length; i++) {
            if (types[i].statType === $scope.analys.statType){
                restUrl = types[i].restUrl;
            }
        }

        var stamp = Utils.createTimestamp();
        var analyse = $scope.analys;
        var name =  'Predict_' +  analyse.statType + '_on_' + selectedItem.name + '_' + stamp;

        var columns = analyse.output.columns;
        var query =  'SELECT ' + columns.splice(1,columns.length-1).join(',') + ' from ' + selectedItem.table;


        Statistics.predict(restUrl, {
            name: name,
            modelAnalysisId: analyse.id,
            query: query,
            datasetTable: selectedItem.table + '_predict_' + stamp,
            datasetName: $scope.datasetName,
            datasetUrl: 'file:///etc/span/data/' + stamp + '.parquet'
        }).then(function () {
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