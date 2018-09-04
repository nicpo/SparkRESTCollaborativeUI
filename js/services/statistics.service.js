app.factory('Statistics', ['$resource', 'baseApi', '$http', '$rootScope', function ($resource, baseApi, $http, $rootScope) {
    'use strict';

    var notifyCollectionChanged = function () {
        $rootScope.$broadcast('AnalysisAdded');
    };
    return {
        correlation: function (corr) {
            return $http.post(baseApi + 'statistics/correlation', {
                name: corr.name,
                query: corr.query,
                method: corr.method
            }).then(notifyCollectionChanged);
        },
        kmeans: function (kmeans) {
            return $http.post(baseApi + 'statistics/kmeans', {
                name: kmeans.name,
                query: kmeans.query,
                clusters: kmeans.clusters,
                iterations: kmeans.iterations,
                runs: kmeans.runs
            }).then(notifyCollectionChanged);
        },
        linearRegression: function (lRegression) {
            return $http.post(baseApi + 'statistics/linearRegression', {
                name: lRegression.name,
                query: lRegression.query,
                iterations: lRegression.iterations
            }).then(notifyCollectionChanged);
        },
        logisticRegression: function (lRegression) {
            var body = {};
            body.name = lRegression.name;
            body.query = lRegression.query;
            // todo remove or uncomment
            //body.iterations = lRegression.iterations;
            body.regularizationType = lRegression.regularizationType.id;
            if (lRegression.regularizationType.id != 'none') {
                body.regularizationParameter = lRegression.regularizationParameter;
            }
            body.trainingSize = lRegression.trainingSize;
            return $http.post(baseApi + 'statistics/logisticRegression', body).then(notifyCollectionChanged);
        },
        summary: function (summ) {
            return $http.post(baseApi + 'statistics/summary', {
                name: summ.name,
                query: summ.query
            }).then(notifyCollectionChanged);
        },
        svm: function (svm) {
            var body = {};
            body.name = svm.name;
            body.query = svm.query;
            body.iterations = svm.iterations;
            body.regularizationType = svm.regularizationType.id;
            if (svm.regularizationType.id != 'none') {
                body.regularizationParameter = svm.regularizationParameter;
            }
            body.trainingSize = svm.trainingSize;
            body.miniBatchFraction = svm.miniBatchFraction;
            // todo remove or uncomment
            // body.stepSize = svm.stepSize;
            return $http.post(baseApi + 'statistics/svm', body).then(notifyCollectionChanged);
        },
        predict: function (statType, prediction) {
            return $http.post(baseApi + 'statistics/' + statType + '/predict', prediction);
        },
        naiveBayes: function (nBayes) {
            var body = {};
            body.name = nBayes.name;
            body.query = nBayes.query;
            body.trainingSize = nBayes.trainingSize;
            body.lambda = nBayes.lambda;
            return $http.post(baseApi + 'statistics/bayes', body).then(notifyCollectionChanged);
        },
        decisionTree: function (dTree) {
            var body = {};
            body.name = dTree.name;
            body.query = dTree.query;
            body.algo = dTree.algo;
            if(body.algo === 'classification')
                body.numClasses = dTree.numClasses;
            // todo: add categorical features info
            body.impurity = dTree.impurity;
            body.maxDepth = dTree.maxDepth;
            body.minInstancesPerNode = dTree.minInstancesPerNode;
            body.minInfoGain = dTree.minInfoGain;
            body.maxBins = dTree.maxBins;
            body.trainingSize = dTree.trainingSize;
            return $http.post(baseApi + 'statistics/decisionTree', body).then(notifyCollectionChanged);
        },
        randomForest: function (rForest) {
            var body = {};
            body.name = rForest.name;
            body.query = rForest.query;
            body.algo = rForest.algo;
            if(body.algo === 'classification')
                body.numClasses = rForest.numClasses;
            // todo: add categorical features info
            body.impurity = rForest.impurity;
            body.maxDepth = rForest.maxDepth;
            //body.minInstancesPerNode = dTree.minInstancesPerNode;
            //body.minInfoGain = dTree.minInfoGain;
            body.maxBins = rForest.maxBins;
            body.numTrees = rForest.numTrees;
            body.subsamplingRate = rForest.subsamplingRate;
            body.featureSubsetStrategy = rForest.featureSubsetStrategy;
            body.trainingSize = rForest.trainingSize;
            return $http.post(baseApi + 'statistics/randomForest', body).then(notifyCollectionChanged);
        }

    };
}]);