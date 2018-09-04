app.factory('Comments', ['$resource', 'baseApi', '$http', function ($resource, baseApi, $http) {
    var resourceName = 'comment';

    var instance = new function () {
        this.getForAnalysis = function (id) {
            return $http.get(baseApi + 'core/list/' + resourceName + 'ForAnalysis/' + id).then(function (resp) {
                return resp.data;
            });
        };
        this.getForDataset = function (id) {
            return $http.get(baseApi + 'core/list/' + resourceName + 'ForDataset/' + id).then(function (resp) {
                return resp.data;
            });
        };

        this.update = function (id, comment) {
            return $http.put(baseApi + resourceName + '/' + id, comment).then(function (resp) {
                return resp.data;
            });
        };

        this.save = function (obj) {
            return $http.post(baseApi + resourceName + '/', obj).then(function (resp) {
                return resp.data;
            });
        };

        this.delete = function (id) {
            return $http.delete(baseApi + resourceName + '/' + id);
        };
    };

    return instance;

    //return $resource(
    //    baseApi + resourceName + '/:id',
    //    {},
    //    {
    //        getForAnalysis: {
    //            method: 'GET',
    //            url: baseApi + 'core/list/' + resourceName + 'ForAnalysis/:id',
    //            isArray: true
    //        },
    //        getForDataset: {
    //            method: 'GET',
    //            url: baseApi + 'core/list/' + resourceName + 'ForDataset/:id',
    //            isArray: true
    //        },
    //        update: {
    //            method: 'PUT'
    //        }
    //    });
}]);