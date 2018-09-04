app.controller('ImportCtrl', ['$scope', 'Import', 'Datasets', 'Utils', 
function ($scope, Import, Datasets, Utils) {
	$scope.step = 0;
    $scope.activeColumn = 0;

    var bucket, key;
    $scope.stepOneNext = function () {
        $scope.$broadcast('show-errors-check-validity');
        if (!$scope.stepOneForm.$valid) {
            return;
        }

        $scope.step++;
        var separator = $scope.fileLocation.lastIndexOf('/');
        bucket = $scope.fileLocation.slice(0, separator);
        key = $scope.fileLocation.slice(separator + 1, $scope.fileLocation.length);

        Import.guessFormat({bucket: bucket, key: key}).then(function (response) {
                if (response.data.delimiter === ',' || response.data.delimiter === '\t' || response.data.delimiter === ';') {
                    $scope.delimiter = response.data.delimiter;
                } else {
                    $scope.delimiter = 'other';
                    $scope.delimiterValue = response.data.delimiter;
                }
                $scope.delimiter = response.data.delimiter;
                $scope.withHeader = response.data.withHeader;
                $scope.headers = response.data.headers;
                $scope.types = response.data.types;
                $scope.activeColumnType = $scope.types[0];
                return response.data;
            }).then($scope.updatePreview);
    };

    $scope.delimiterChange = function () {
        if (($scope.delimiter !== 'other' || $scope.delimiterValue))
            $scope.updatePreview();
    };

    $scope.delimiterValueChange = function (value) {
        if ($scope.delimiterValue)
            $scope.updatePreview();
    };

    $scope.columnTypeChange = function () {
        $scope.types[$scope.activeColumn] = $scope.activeColumnType;
        $scope.updatePreview();
    };

    $scope.updatePreview = function () {
        $scope.dataLoading = true;
        var delimiter = $scope.delimiter;
        if ($scope.delimiter === 'tab')
            delimiter = '\t';
        else if ($scope.delimiter === 'other')
            delimiter = $scope.delimiterValue;
        Import.getSample({
            bucket: bucket, 
            key: key, 
            format: {
                withHeader: $scope.withHeader,
                delimiter: delimiter,
                headers: $scope.headers,
                types: $scope.types
            }
        }).success(function (data) {
            $scope.previewTable = data;
        }).finally(function (data) {
            $scope.dataLoading = false;
        });
    };

    $scope.selectColumn = function (index) {
        $scope.activeColumn = index;
        $scope.activeColumnType = $scope.types[$scope.activeColumn];
    };

    $scope.finish = function () {
        var resultName = key.substring(0, key.indexOf('.')) + '-' + Utils.createTimestamp() + '.parquet';
        Import.parquet({
            bucket: bucket,
            key: key,
            format: {
                withHeader: $scope.withHeader,
                delimiter: $scope.delimiter !== 'other' ? $scope.delimiter : $scope.delimiterValue,
                headers: $scope.headers,
                types: $scope.types                
            },
            parquetURL: 'file:///etc/span/data/' + resultName
        }).then(function () {
            Datasets.save({
                name: $scope.datasetName,
                table: $scope.tableName,
                url: 'file:///etc/span/data/' + resultName
            }).finally(function (data) {
                console.log('Finished import.');
                $scope.$close();
            });
        });
    };
}]);