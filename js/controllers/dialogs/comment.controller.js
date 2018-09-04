app.controller('CommentCtrl', ['$scope', '$modalInstance', '$timeout', '$rootScope', 'Comments', 'selectedItem', function ($scope, $modalInstance, $timeout, $rootScope, Comments, selectedItem) {

    $scope.selectedItem = selectedItem;
    $scope.confirmComment = function () {
        $scope.inProgress = true;

        var comment = {
            text: $scope.comment
        };
        comment[$scope.selectedItem.type] = $scope.selectedItem.id;
        Comments.save(comment).then(function () {
            $scope.inProgress = false;
            $modalInstance.close();
            $rootScope.$broadcast("CommentAdded");
        });

    };

    $scope.cancelComment = function () {
        $modalInstance.dismiss();
    };

}]);