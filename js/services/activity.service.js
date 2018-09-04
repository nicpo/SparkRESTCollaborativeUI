app.factory('Activity', ['$http', 'baseApi', function ($http, baseApi) {    
    return {
        get: function (body) {
            return $http.get(baseApi + 'core/list/audit');
        }
    };
}]);