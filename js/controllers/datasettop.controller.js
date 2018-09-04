(function (angular) {
    angular.module('AnalyticsApp').controller('DataSetTopCtrl', ['$scope', 'Analyses', 'Info', '$rootScope', '$location', function ($scope, Analyses, Info, $rootScope, $location) {

        $scope.viewState = "DataSetView";
        $scope.AnalysisCtrlEmbedded = true;
        $scope.analysisTemplate = "html/analysis.html";

        $scope.$on('AnalysisSelect', function (event, analyse) {
            $scope.viewState = "AnalyseView";
            $rootScope.$broadcast('AnalysisSelected', analyse);
        });
        $scope.$on('DateSetSelect', function () {
            $scope.viewState = "DataSetView";
        });
        $scope.$on('DataSetDeleted', function () {
            $location.path('dashboard');
        });
        console.log('DataSetTopCtrl');

    }]);
})(angular);
