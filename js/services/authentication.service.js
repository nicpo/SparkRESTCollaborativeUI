app.factory('Auth', ['$http', '$q', 'baseApi', '$injector', '$location', '$rootScope', function ($http, $q, baseApi, $injector, $location, $rootScope) {

    return new function () {
        var startedUp = false, that = this;
        this.login = function (username, password) {
            return $http.post(baseApi + 'core/login', {email: username, password: password});
        };

        this.signOutCommand = function () {
            that.cleanCredentials();
            $location.path('login');
        };

        this.getUserEmail = function () {
            return localStorage.userEmail;
        };
        this.getSid = function () {
            return localStorage.sid;
        };
        this.cleanCredentials = function () {
            localStorage.sid = null;
            localStorage.userEmail = null;
        };

        this.storeCredentials = function (sid, userEmail) {
            localStorage.sid = sid;
            localStorage.userEmail = userEmail;
        };

        this.credentialsAvailable = function () {
            return localStorage.sid != "null" && localStorage.userEmail != "null";
        };


        this.startUpCommand = function (config) {

            var loginDefer = $q.defer();

            if (config.clean) {
                startedUp = false;
                that.cleanCredentials();
            }

            if (startedUp && that.credentialsAvailable()) {
                loginDefer.resolve();
                return loginDefer.promise;
            }

            $rootScope.$broadcast('startingUp');

            if (config.clean) {
                that.login(config.username, config.password).then(function (response) {
                    that.storeCredentials(response.data.sid, response.data.user.id);
                    startedUp = true;
                    $rootScope.$broadcast('startedUp');
                    loginDefer.resolve();
                }).catch(function (response) {
                    var message = '';
                    if (response.status === 401) {
                        message = 'Invalid username or password';
                    } else {
                        message = 'Server error';
                    }
                    loginDefer.reject(message);
                });
            } else {
                if (that.credentialsAvailable()) {
                    $rootScope.$broadcast('startedUp');
                    startedUp = true;
                    loginDefer.resolve();
                } else {
                    that.signOutCommand();
                }
            }

            return loginDefer.promise;
        };

    };
}]);