app.factory('Datasets', ['$resource', 'baseApi', '$injector', '$http', function ($resource, baseApi, $injector, $http) {
    var resourceName = 'dataset';


    var applyDefaults = function (item) {
        item.type = 'dataset';
    };

    var instance = new function () {

        this.getForUser = function () {
            var permissionService = $injector.get('Permissions');
            return permissionService.fetchPermissions().then(function () {
                return $http.get(baseApi + 'core/list/' + resourceName + 'ForUser');
            }).then(function (response) {
                response.data.map(function (item) {
                    applyDefaults(item);
                    permissionService.applyPermissions(item, false);
                });
                $injector.get('Info').loadComments(response.data, 'dataset');
                return response.data;
            });

        };

        this.download = function (id) {
            window.open(baseApi + 'dataset/csv/' + $injector.get('Auth').getSid() + '/' + id, "_blank");
        };

        this.update = function (id, obj) {
            return $http.put(baseApi + resourceName + '/' + id,
                {
                    description: obj.description,
                    id: obj.id,
                    info: obj.info,
                    name: obj.name,
                    query: obj.query,
                    table: obj.table,
                    timestamp: obj.timestamp,
                    url: obj.url,
                    user: obj.user
                });
        };

        this.remove = function (id) {
            return $http.delete(baseApi + resourceName + '/' + id);
        };

        // Physically removes a dataset file and de-registers it from the system
        this.deleteAndRemove = function (obj) {
            var datasetUrl = obj.url;
            return $http.delete(baseApi + resourceName + '/' + obj.id
            ).then(function () {
                    return $http({
                        url: baseApi + 'core/deleteParquet',
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'text/plain'
                        },
                        data: datasetUrl
                    });
                });
        };

        this.getSample = function (id) {
            return $http.get(baseApi + resourceName + '/sample/' + id, {params: {rowCount: 20}}).then(function (resp) {
                return resp.data;
            });
        };

        this.snapshot = function (obj) {
            return $http.post(baseApi + resourceName + '/snapshot/', obj).then(function (resp) {
                return resp.data;
            });
        };

        this.getDatasetSize = function (url) {
            return $http.put(baseApi + 'core/datasetSize', url, {headers: {'Content-type' : 'text/plain'}});
        };

        this.get = function (id) {
            var permissionService = $injector.get('Permissions');
            return permissionService.fetchPermissions().then(function () {
                return $http.get(baseApi + resourceName + '/' + id);
            }).then(function (response) {
                var dataset = response.data;
                applyDefaults(dataset);
                try {
                  dataset.metaData = JSON.parse(dataset.size);
                }
                catch(e) {
                  dataset.metaData = '';
                }
                permissionService.applyPermissions(dataset, false);
                return dataset;
            });
        };

        this.save = function (obj) {
            return $http.post(baseApi + 'dataset', obj).then(function (resp) {
                return resp.data;
            });
        };

    };

    return instance;

}]);