app.controller('AnalysisCtrl', ['$scope', '$routeParams', '$rootScope', 'Analyses', 'Info', function ($scope, $routeParams, $rootScope, Analyses, Info) {



    var setupView = function (anId) {
        $scope.analyseLoadingState = true;
        Info.setContext(null);
        Info.setLayout('analysisDetails');

        Analyses.get(anId).then(function (data) {
            Info.setAnalysisContext(data);
            $scope.canComment = data.permissions.indexOf('COMMENT') > -1;
            $scope.analysis = data;
        }).finally(function () {
            $scope.analyseLoadingState = false;
        });
    };


    if (!$scope.AnalysisCtrlEmbedded) {
        Info.setLayout('analysisDetails');
        setupView($routeParams.id);
    } else {
        $scope.$on('AnalysisSelected', function (event, analyse) {
            setupView(analyse.id);
        });
    }

    $scope.$on('commentsUpdated', function () {
        $scope.commentThreads = Info.getTargetedThreads();
    });

    console.log('AnalysisCtrl');
}]);