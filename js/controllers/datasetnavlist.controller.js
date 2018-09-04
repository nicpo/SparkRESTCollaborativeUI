(function (angular) {
    angular.module('AnalyticsApp').controller('DataSetNavListCtrl', ['$scope', 'Analyses', '$rootScope', 'Info', function ($scope, Analyses, $rootScope, Info) {

        var currentDataset = {};

        var reloadAnalysisList = function () {
            $scope.navListLoadingState = true;
            Analyses.relatedAnalysisForDataset(currentDataset.id).then(function (data) {
                $scope.relatedAnalyses = data;
            }).finally(function () {
                $scope.navListLoadingState = false;
            });
        };

        $scope.$on('infoUpdate', function (event, data) {
            if (data != null && data.type === 'dataset' && data.id !== currentDataset.id) {
                $scope.selectedItem = $scope.dataset = currentDataset = data;
                reloadAnalysisList();
            }
        });

        $scope.$on('AnalysisAdded', function () {
            reloadAnalysisList();
        });

        $scope.$on('AnalysisDeleted', function () {
            $scope.selectedItem = currentDataset;
            $scope.focusedItem = null;
            reloadAnalysisList();
        });

        $scope.onItemClick = function (item) {
            if ($scope.selectedItem !== item) {
                $scope.focusedItem = item;
            }
        };

        $scope.onDatasetClick = function (item) {
            $scope.selectedItem = item;
            $rootScope.$broadcast('DateSetSelect', currentDataset);
            Info.setDatasetContext(currentDataset);
        };

        $scope.onDblClick = function (item) {
            $scope.selectedItem = item;
            $rootScope.$broadcast('AnalysisSelect', item);
        };

        console.log('DataSetNavListCtrl');

    }]);
})(angular);
