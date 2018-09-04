app.controller('DatasetCtrl', ['$scope', '$routeParams', '$rootScope', '$modal', 'Comments', 'Datasets', 'Info', 'Utils',
    function ($scope, $routeParams, $rootScope, $modal, Comments, Datasets, Info, Utils) {

        $scope.filters = [];
        $scope.features = [];

        Datasets.get($routeParams.id).then(function (data) {
            Info.setDatasetContext(data);
            $scope.metaData = data.metaData;
            $scope.canComment = data.permissions.indexOf('COMMENT') > -1;
            updateSample();
        });

        $scope.$on('commentsUpdated', function (groupedThreads) {
            $scope.commentThreads = Info.getTargetedThreads();
        });

        $scope.deleteFilter = function (filter) {
            $scope.filters.splice($scope.filters.indexOf(filter), 1);
            filterOrFeatureDeleted();
        };

        $scope.$on('filterAdded', function (event, filter) {
            $scope.filters.push(filter);
            filterOrFeatureAdded();
        });

        $scope.$on('featureAdded', function (event, feature) {
            $scope.features.push(feature);
            filterOrFeatureAdded();
        });

        $scope.$on('featuresDeleted', function (event, features) {
            $scope.features = [];
            for (var i = 0; i < features.length; i++) {
                if (!features[i].checked)
                    $scope.features.push(features[i]);
            }
            filterOrFeatureDeleted();
        });

        $scope.$on('viewSaved', function () {
            $scope.filters = [];
            $scope.features = [];
            Info.setDatasetContext(Info.getItem());
            updateSample();
        });

        function filterOrFeatureAdded() {
            var query = buildQuery();
            if ($scope.filters.length + $scope.features.length === 1) {
                setViewForDataset(query);
            } else {
                Datasets.deleteAndRemove(Info.getView()).then(function () {
                    setViewForDataset(query);
                });
            }
        }

        function filterOrFeatureDeleted() {            
            var dataset = Info.getItem();
            if ($scope.filters.length + $scope.features.length === 0) {
                Datasets.remove(Info.getView().id).then(function (data) {
                    Info.setView({});
                    dataset.info = '';
                    return Datasets.update(dataset.id, dataset);
                }).then(function () {
                    Info.setItem(dataset);
                    updateSample();
                });
            } else {
                var query = buildQuery();
                Datasets.remove(Info.getView().id).then(function () {
                    setViewForDataset(query);
                });
            }
        }

        function setViewForDataset(query) {
            var dataset = angular.copy(Info.getItem()),
                timestamp = Utils.createTimestamp();

            return Datasets.snapshot({
                query: query,
                url: 'file:///etc/span/data/' + timestamp + '.parquet',
                table: 'table' + timestamp,
                name: timestamp
            }).then(function (data) {
                data.info = angular.toJson({
                    type: 'view',
                    filters: $scope.filters,
                    features: $scope.features
                });
                return Datasets.update(data.id, data);
            }).then(function (response) {
                Info.setView(response.data);
                dataset.info = angular.toJson({
                    type: 'has_view',
                    view: response.data.id
                });
                return Datasets.update(dataset.id, dataset);
            }).then(function () {
                Info.setItem(dataset);
                updateSample();
            });
        }

        function buildQuery() {
            var dataset = Info.getItem(),
                query = 'SELECT * FROM (SELECT * ';

            $scope.features.forEach(function (feature, i) {
                query += ', ' + feature.query + ' as ' + feature.name;
            });

            query += ' FROM ' + dataset.table + ') as sel ';

            $scope.filters.forEach(function (filter, i) {
                if (i === 0)
                    query += ' WHERE (' + filter + ')';
                else query += ' AND (' + filter + ')';
            });

            return query;
        }

        function updateSample() {
            $scope.sampleLoading = true;
            var dataset = Info.getItem(),
                info;
            if (dataset.info && dataset.info.indexOf('{') > -1)
                info = angular.fromJson(dataset.info);
            if (info && info.view) {
                if (Info.getView().id) {
                    // view already loaded
                    Datasets.getSample(Info.getView().id).then(onSampleSuccess);
                } else {
                    // view exists but not loaded
                    Datasets.get(info.view).then(function (data) {
                        Info.setView(data);
                        var dataInfo = angular.fromJson(data.info);
                        $scope.filters = dataInfo.filters;
                        $scope.features = dataInfo.features;
                        return Datasets.getSample(data.id);
                    }).then(onSampleSuccess);
                }
            } else {
                // no view for dataset
                Datasets.getSample(dataset.id).then(onSampleSuccess);
            }
        }

        function onSampleSuccess(data) {
            $scope.sampleLoading = false;
            $scope.sampleTable = data;
            var headers = data[0];
            var context = Info.getContext();
            context.headers = headers;
            context.item.headers = headers;
            $rootScope.$broadcast('headersLoaded', headers);
            $rootScope.$broadcast('featuresChanged', $scope.features);
        }

        $scope.$on('DateSetSelect', function(){
            Info.setLayout('dataSet');
        });
        Info.setLayout('dataSet');
    }]);