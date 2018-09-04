app.factory('Import', ['$http', 'baseApi', function ($http, baseApi) {    
    return {
        guessFormat: function (body) {
            return $http.post(baseApi + 'import/guessFormat', body);
        },
        getSample: function (body) {
            return $http.post(baseApi + 'import/sample', body);
        },
        parquet: function (body) {
            return $http({
                url: baseApi + 'import/parquet',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: body,
                transformResponse: [function (data) {                
                    return data;
                }]
            });
        }
    };
}]);