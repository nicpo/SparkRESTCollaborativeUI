app.controller('DeleteCtrl', ['$scope', 'Datasets', '$modalInstance', '$timeout', '$rootScope', 'selectedItem', 'Analyses', function ($scope, Datasets, $modalInstance, $timeout, $rootScope, selectedItem, Analyses) {

    var deleteService = null;
    if (selectedItem.type == 'dataset') {
        deleteService = {
            onDeleteConfirm: function () {
                return Datasets.remove(selectedItem.id);
            },
            onDeleteSuccess: function () {
                $rootScope.$broadcast('DataSetDeleted');
            }
        };

    } else if (selectedItem.type == 'analysis') {
        deleteService = {
            onDeleteConfirm: function () {
                return Analyses.remove(selectedItem.id);
            },
            onDeleteSuccess: function () {
                $rootScope.$broadcast('AnalysisDeleted');
            }
        };
    }
    $scope.selectedItem = selectedItem;
    $scope.confirmDelete = function () {
        $scope.inProgress = true;
        deleteService.onDeleteConfirm().then(function () {
            deleteService.onDeleteSuccess();
            $modalInstance.close();
        }).catch(function () {
            //todo: error handling
        }).finally(function () {
            $scope.inProgress = false;
        });
    };

    $scope.cancelDelete = function () {
        $modalInstance.dismiss();
    };

}]);