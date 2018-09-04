app.controller('ShareCtrl', ['$scope', 'Datasets', '$modalInstance', '$timeout', '$rootScope', 'Permissions', 'selectedItem', 'Utils', function ($scope, Datasets, $modalInstance, $timeout, $rootScope, Permissions, selectedItem, Utils) {

    var shareOptions = [
        {name: 'View', id: 'VIEW'},
        {name: 'Comment', id: 'COMMENT'},
        {name: 'Analyze', id: 'ANALYZE'}
    ];


    var optionById = function (type) {
        for (var it = 0; it < shareOptions.length; it++) {
            if (shareOptions[it].id == type)
                return shareOptions[it];
        }

        return null;
    };

    var users = [];

    $scope.selectedItem = selectedItem;

    $scope.dataLoading = true;
    Permissions.rolesForItem(selectedItem.id, $scope.selectedItem.type === 'analysis').then(function (roles) {
        roles.forEach(function (role) {
            users.push(
                {
                    email: role.user,
                    selectedOption: optionById(role.id),
                    emailError: false
                }
            );
        });

    }).catch(function () {

    }).finally(function () {
        $scope.dataLoading = false;
    });


    $scope.users = users;
    $scope.shareOptions = shareOptions;

    $scope.addUser = function () {
        users.push({
            email: '',
            selectedOption: shareOptions[0],
            emailError: false
        });
    };

    var submitAttempted = false;
    var validateInputs = function () {
        var valid = true;
        if (!submitAttempted)
            return;

        users.forEach(function (user) {
            user.emailError = !Utils.validate.testEmail(user.email);
            valid = valid && !user.emailError;
        });

        return valid;
    };

    $scope.$watch('users', function () {
        validateInputs();
    }, true);

    $scope.removeUser = function (user) {
        users.splice(users.indexOf(user), 1);
    };

    $scope.onConfirmClick = function () {
        var roles, itemToShare, promise;
        submitAttempted = true;
        if (!validateInputs())
            return;

        $scope.inProgress = true;

        itemToShare = $scope.selectedItem;

        roles = [];
        users.forEach(function (user) {
            roles.push({id: user.selectedOption.id, user: user.email});
        });

        promise = Permissions.saveRolesForItem(selectedItem.id, roles, itemToShare.type === 'analysis');

        promise.then(function () {
            $modalInstance.dismiss();
        }).catch(function () {
            //todo raise and handle exceptions
        }).finally(function () {
            $scope.inProgress = false;
        });


    };

    $scope.setSelectedOption = function (user, option) {
        user.selectedOption = option;
    };

    $scope.onCancelClick = function () {
        $modalInstance.dismiss();
    };

}]);