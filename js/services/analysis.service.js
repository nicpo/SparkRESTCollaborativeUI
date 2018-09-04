app.factory('Analyses', ['$resource', 'baseApi', '$http', '$q', '$injector', '$rootScope', function ($resource, baseApi, $http, $q, $injector, $rootScope) {
    var resourceName = 'analysis';

    var predictTypes = [
        {
            name: '',
            statType: 'all'
        },
        {
            name: 'Logistic regression',
            statType: 'LogisticRegression',
            restUrl: 'logisticRegression'
        },
        {
            name: 'Linear regression',
            statType: 'LinearRegression',
            restUrl: 'linearRegression'
        },
        {
            name: 'SVM',
            statType: 'SVM',
            restUrl: 'svm'
        },
        {
            name: 'K-Means Clustering',
            statType: 'KMeans',
            restUrl: 'kmeans'
        },
        {
            name: 'Naive Bayes',
            statType: 'NaiveBayes',
            restUrl: 'bayes'
        },
        {
            name: 'Decision tree',
            statType: 'DecisionTree',
            restUrl: 'decisionTree'
        },
        {
            name: 'Random forest',
            statType: 'RandomForest',
            restUrl: 'randomForest'
        }];

    var applyDefaults = function (item, statType) {
        item.statType = statType;
        item.type = 'analysis';
    };

    var filterPredict = function (analyse) {
        var type = analyse.type;
        return type.indexOf('Predict', type.length - 'Predict'.length) === -1;
    };

    var instance = new function () {
        this.getPredictTypes = function () {
            return predictTypes;
        };
        this.getForPredict = function () {
            return $http.get(baseApi + 'core/list/' + resourceName + 'ForUser').then(function (response) {
                var data = response.data;
                data.map(function (item) {
                    applyDefaults(item, item.type);
                });
                data = data.filter(function (analys) {
                    var i = 0;
                    for (i = 0; i < predictTypes.length; i++) {
                        if (analys.statType === predictTypes[i].statType) {
                            analys.output = JSON.parse(analys.output);
                            return analys.output.columns.length > 1;
                        }
                    }
                    return false;
                });

                return data;
            });
        };
        this.getForUser = function () {
            var permissionService = $injector.get('Permissions');
            return permissionService.fetchPermissions().then(function () {
                return $http.get(baseApi + 'core/list/' + resourceName + 'ForUser');
            }).then(function (response) {
                var data = response.data.filter(filterPredict);
                data.map(function (item) {
                    applyDefaults(item, item.type);
                    permissionService.applyPermissions(item, true);
                });
                $injector.get('Info').loadComments(data, 'analysis');
                return data;
            });
        };

        this.get = function (id) {
            var permissionService = $injector.get('Permissions');
            return permissionService.fetchPermissions().then(function () {
                return $http.get(baseApi + resourceName + '/' + id);
            }).then(function (response) {
                var data = response.data;
                applyDefaults(data, data.type);
                data.request = JSON.parse(data.request);
                data.output = JSON.parse(data.output);
                permissionService.applyPermissions(data, true);
                return data;
            });

        };

        this.remove = function (id) {
            return $http.delete(baseApi + resourceName + '/' + id);
        };

        this.relatedAnalysisForDataset = function (datasetId) {
            return $http.get(baseApi + 'core/relatedAnalysisForDataset/' + datasetId).then(function (response) {
                return response.data.filter(filterPredict);
            });
        };

        this.update = function (id, obj) {
            return $http.put(baseApi + resourceName + '/' + id,
                {
                    id: obj.id,
                    name: obj.name,
                    query: obj.query,
                    description: obj.description
                });
        };
    };


    return instance;

}]);