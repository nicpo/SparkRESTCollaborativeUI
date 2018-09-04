var app = angular.module('AnalyticsApp', [
    'ngResource',
    'ngRoute',
    'route-segment',
    'view-segment',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'anDirectives',
    'xeditable'
]);

app.config(['$httpProvider', '$routeSegmentProvider', '$provide', '$injector', function ($httpProvider, $routeSegmentProvider, $provide) {
    // TODO: Insert URL of the SparkRESTCollaborative app REST endpoint below, e.g. http://somesite.com/rest/
    $provide.value('baseApi', '<URL here>');

    $httpProvider.interceptors.push('$q', '$injector', function ($q, $injector) {
        return {
            'request': function (config, Auth) {
                if (config.url.indexOf('/rest/core/login') === -1 && config.url.indexOf('/rest/') !== -1) {
                    config.headers['sid'] = $injector.get('Auth').getSid();
                }
                return config;
            },
            'responseError': function (rejection) {
                if (rejection.status == '401') {
                    $injector.get('Auth').signOutCommand();
                }
                return $q.reject(rejection);
            }
        };
    });


    $routeSegmentProvider
        .when('/', 'login')
        .segment('login', {
            templateUrl: 'html/login.html',
            controller: 'LoginCtrl'
        });

    $routeSegmentProvider
        .when('/login', 'login')
        .segment('login', {
            templateUrl: 'html/login.html',
            controller: 'LoginCtrl'
        });

    var Resolvers = new function () {

    };

    $routeSegmentProvider
        .when('/dashboard', 'main.dashboard')
        .when('/dataset/:id', 'main.dataset')
        .when('/analysis/:id', 'main.analysis')
        .segment('main', {
            templateUrl: 'html/main.html',
            controller: 'MainCtrl'
        })
        .within()
        .segment('dashboard', {
            templateUrl: 'html/dashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
                startUpCommand: function (Auth) {
                    return Auth.startUpCommand({});
                }
            }
        })
        .segment('dataset', {
            templateUrl: 'html/dataset.html',
            controller: 'DataSetTopCtrl',
            resolve: {
                startUpCommand: function (Auth) {
                    return Auth.startUpCommand({});
                }
            }
        })
        .segment('analysis', {
            templateUrl: 'html/analysis.html',
            controller: 'AnalysisCtrl',
            resolve: {
                startUpCommand: function (Auth) {
                    return Auth.startUpCommand({});
                }
            }
        });

}]);

app.run(['$rootScope', 'editableOptions', function ($rootScope, editableOptions) {
    editableOptions.theme = 'bs3';
}]);




