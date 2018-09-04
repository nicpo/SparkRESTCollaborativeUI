'use strict';
app.factory('Permissions', ['$resource', 'baseApi', '$http', '$q', '$injector', '$rootScope', function ($resource, baseApi, $http, $q, $injector) {

    var instance = new function () {
        var userId = null, dataSetRoleMap, analysisRoleMap, dataSetMap = {}, analysisMap = {};
        dataSetRoleMap = {
            VIEW: ['VIEW', 'VIEW-SAMPLE', 'VIEW-COMMENTS'],
            COMMENT: ['VIEW', 'VIEW-SAMPLE', 'VIEW-COMMENTS', 'COMMENT'],
            ANALYZE: ['VIEW', 'VIEW-SAMPLE', 'RAW-DATA', 'VIEW-COMMENTS', 'EDIT', 'SHARE', 'ANALYZE', 'COMMENT', 'DELETE']
        };

        analysisRoleMap = {
            VIEW: ['VIEW', 'VIEW-COMMENTS'],
            COMMENT: ['VIEW', 'COMMENT', 'VIEW-COMMENTS'],
            ANALYZE: ['VIEW', 'SHARE', 'COMMENT', 'VIEW-COMMENTS', 'DELETE', 'EDIT']
        };

        function toRole(permissions, isAnalysis) {
            var isAnalyse, isComment, map = isAnalysis ? analysisRoleMap : dataSetRoleMap;
            isAnalyse = permissions.length === map.ANALYZE.length && permissions.every(function (type) {
                return map.ANALYZE.indexOf(type) !== -1;
            });

            if (isAnalyse) {
                return 'ANALYZE';
            }

            isComment = permissions.length === map.COMMENT.length && permissions.every(function (type) {
                return map.COMMENT.indexOf(type) !== -1;
            });

            if (isComment) {
                return 'COMMENT';
            }

            return 'VIEW';

        }

        function toRoles(permissions, isAnalysis) {
            var usersWithPermissions = {};
            var result = [];
            permissions.forEach(function (item) {
                if (!usersWithPermissions[item.user]) {
                    usersWithPermissions[item.user] = [];
                }
                usersWithPermissions[item.user].push(item.type);
            });

            for (var user in usersWithPermissions) {
                if (usersWithPermissions.hasOwnProperty(user)) {
                    result.push({user: user, id: toRole(usersWithPermissions[user], isAnalysis)});
                }
            }

            return result;
        }

        function toPermissions(roles, isAnalysis) {
            var map = isAnalysis ? analysisRoleMap : dataSetRoleMap, result = [];
            roles.forEach(function (role) {
                result.push({user: role.user, permissions: map[role.id]});
            });
            return result;
        }

        this.saveRolesForItem = function (id, roles, isAnalysis) {
            var url = isAnalysis ? 'permission/analysis/' : 'permission/dataset/';
            var saveDeffer = $q.defer(), items = toPermissions(roles, isAnalysis);
            $http.post(baseApi + url + id, items).then(function (response) {
                saveDeffer.resolve(response);
            }).catch(function (response) {
                    saveDeffer.reject(response);
                }
            );
            return saveDeffer.promise;
        };

        this.fetchPermissions = function () {
            var deffer = $q.defer();

            var user = $injector.get('Auth').getUserEmail();
            $http.get(baseApi + 'core/list/permissionForUser/' + user).then(function (response) {
                setCurrentPermissions(response, user);
                deffer.resolve();
            }).catch(function () {
                deffer.reject();
            });

            return deffer.promise;
        };

        this.rolesForItem = function (id, isAnalysis) {
            var url = isAnalysis ? 'core/list/permissionForAnalysis/' : 'core/list/permissionForDataset/';

            var deffer = $q.defer();

            $http.get(baseApi + url + id).then(function (response) {

                deffer.resolve(toRoles(response.data, isAnalysis));

            }).catch(function (response) {

                deffer.reject(response);

            });

            return deffer.promise;
        };

        function setCurrentPermissions(perms, user) {
            dataSetMap = {};
            analysisMap = {};
            userId = user;
            perms.data.forEach(function (permission) {
                if (permission.dataset) {
                    var datasetId = permission.dataset;
                    if (!dataSetMap[datasetId]) {
                        dataSetMap[datasetId] = [];
                    }
                    dataSetMap[datasetId].push(permission.type);
                } else if (permission.analysis) {
                    var anId = permission.analysis;
                    if (!analysisMap[anId]) {
                        analysisMap[anId] = [];
                    }
                    analysisMap[anId].push(permission.type);
                }
            });
        };


        this.applyPermissions = function (item, isAnalysis) {

            var dataSets;
            var analysis;
            // we don't have permission objects, if it is owner
            if (item.user === userId) {
                item.permissions = isAnalysis ? analysisRoleMap.ANALYZE : dataSetRoleMap.ANALYZE;
                return;
            }

            if (isAnalysis) {
                analysis = analysisMap[item.id];
                item.permissions = analysis ? analysis : [];
            } else {
                dataSets = dataSetMap[item.id];
                item.permissions = dataSets ? dataSets : [];
            }
        };

    };


    return instance;
}]);