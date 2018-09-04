app.controller('SidebarCtrl', ['$scope', 'Info', 'Comments', '$rootScope', 'Datasets', 'Analyses', function ($scope, Info, Comments, $rootScope, Datasets, Analyses) {

    var localData = {
        item: null
    };
    $scope.showSidebar = false;
    $scope.sidebarSelectedBlock = 'Comments';

    $scope.updateDescription = function (data) {
        var item = localData.item;
        var copy = angular.copy(item);
        copy.description = data;
        var serviceInstance = item.type === 'dataset' ? Datasets : Analyses;
        return serviceInstance.update(copy.id, copy).then(function (resp) {
            item.description = resp.data.description;
            $rootScope.$broadcast('AnItemChanged', item);
        });
    };

    $scope.updateName = function (data) {
        var item = localData.item;
        var copy = angular.copy(item);
        copy.name = data;
        var serviceInstance = item.type === 'dataset' ? Datasets : Analyses;
        return serviceInstance.update(copy.id, copy).then(function (resp) {
            item.name = resp.data.name;
            $rootScope.$broadcast('AnItemChanged', item);
        });

    };

    $scope.$on('infoPanelEvent', function (event, data) {
        $scope.showSidebar = data.show;
    });

    $scope.$on('infoUpdate', function (event, data) {

        var applyItem = function () {
            $scope.item = localData.item = data;
            $scope.canEdit = localData.item && (localData.item.permissions.indexOf('EDIT') !== -1);
        };

        if (data && data.type === 'dataset' && data.metaData == null ) {
            Datasets.getDatasetSize(data.url).then(
                function (response) {
                    data.metaData = response.data;
                    applyItem();
                });
        } else {
            applyItem();
        }


    });

    $scope.$on('commentsUpdated', function (event, data) {
        $scope.canComment = localData.item && (localData.item.permissions.indexOf('COMMENT') !== -1);
        if (localData.item == null) {
            $scope.threads = null;
            return;
        }
        $scope.threads = Info.getContext().commentThreads;
    });

    $scope.onNameClick = function () {
        if ($scope.canEdit) {
            $scope.nameEditForm.$show();
        }
    };

    $scope.onDescriptionClick = function () {
        if ($scope.canEdit) {
            $scope.descriptionEditForm.$show();
        }
    };
}]);