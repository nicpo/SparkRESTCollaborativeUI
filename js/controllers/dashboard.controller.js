app.controller('DashboardCtrl', ['$scope', '$location', '$rootScope', '$modal', 'Datasets', 'Analyses', 'Info', 'Utils',
    function ($scope, $location, $rootScope, $modal, Datasets, Analyses, Info, Utils) {

        var loadingCounter = Utils.misc.buildCounter($scope, 'loadingTiles');

        $scope.menuItems = [
            {
                label: 'Datasets',
                itemClass: 'an-dataset-item',
                selected: true,
                id: 'Dataset'
            },
            {
                label: 'Analysis',
                id: 'Analysis',
                itemClass: 'an-analysis-item'
            }
        ];

        var selectedItem = $scope.menuItems[0];

        $scope.onItemClick = function (item) {
            if (selectedItem != item) {
                selectedItem.selected = false;
                item.selected = true;
                selectedItem = item;
                applyView();
            }
        };


        var applyView = function () {
            $scope.selectedView = selectedItem.id;
            $scope.activeItem = null;
            Info.setContext(null);
        };

        applyView();

        $scope.openDataset = function (dataset) {
            Info.setLayout(null);
            $location.path('dataset/' + dataset.id);
        };

        $scope.openAnalysis = function (analysys) {
            if (analysys.state == 'ERROR')
                return;
            Info.setLayout(null);
            $location.path('analysis/' + analysys.id);
        };

        var requestDataSets = function () {
            loadingCounter.up();
            Datasets.getForUser().then(function (data) {
                $scope.datasets = data;
            }).finally(function () {
                loadingCounter.down();
            });
        };

        var requestAnalysis = function (fetchPermissions) {
            loadingCounter.up();
            Analyses.getForUser(fetchPermissions).then(function (data) {
                $scope.analyses = data;
            }).finally(function () {
                loadingCounter.down();
            });
        };

        $scope.$on('DataSetDeleted', function () {
            Info.setDatasetContext(null);
            requestDataSets();
        });

        $scope.$on('AnalysisDeleted', function () {
            Info.setDatasetContext(null);
            requestAnalysis();
        });

        $scope.onTileClick = function (item, type) {
            if (Info.getContext() == null || Info.getContext().id !== item.id) {
                if (type === 'dataset')
                    Info.setDatasetContext(item);
                else Info.setAnalysisContext(item);
            }
            $scope.activeItem = item;
        };

        requestDataSets();
        requestAnalysis();

        console.log('DashboardCtrl');
        Info.setLayout('dashBoard');
        Info.setContext(null);


    }]);