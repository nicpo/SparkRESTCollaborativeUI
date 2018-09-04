app.controller('SaveCtrl', ['$scope', '$rootScope', 'Datasets', 'Info', function ($scope, $rootScope, Datasets, Info) {

    $scope.save = function () {
        $scope.$broadcast('show-errors-check-validity');
        if (!$scope.saveForm.$valid) {
            return;
        }

        var dataset = Info.getItem(),
            view = Info.getView();

        dataset.info = '';
        view.info = '';
        view.name = $scope.name;
        view.description = $scope.description;

        $scope.inProgress = true;
        Datasets.update(dataset.id, dataset).then(function () {
            return Datasets.update(view.id, view);
        }).then(function () {
            Info.setItem(dataset);
            Info.setView(view);
            $rootScope.$broadcast('viewSaved');
            $scope.$close();
        }).finally(function () {
            $scope.inProgress = false;
        });
    };
}]);