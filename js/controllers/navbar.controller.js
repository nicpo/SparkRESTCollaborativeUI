(function (angular) {
    angular.module('AnalyticsApp').controller('NavBarCtrl', ['$scope', '$rootScope', '$modal', '$location', 'Auth', 'Datasets', function ($scope, $rootScope, $modal, $location, Auth, Datasets) {
        var _showSideBar = 0;


        var localModel = {
            headers: [],
            features: [],
            layout: "",
            selectedItem: null
        };


        var ServiceLocator = function ($location, $scope, $modal) {

            var that = this;
            var AbstractStrategy = function ($location, $scope) {
                this.location = $location;
                this.scope = $scope;
                this.onSignOutClick = function () {
                    Auth.signOutCommand();
                };
                this.applyUIState = function () {
                    this.scope.showGridToggle = localModel.layout === 'dashBoard';
                    var contextLabel = '';
                    if (localModel.layout === 'dashBoard') {
                        contextLabel = 'Analytics App';
                    } else {
                        contextLabel = localModel.selectedItem ? localModel.selectedItem.name : '';
                    }
                    this.scope.contextLabel = contextLabel;
                };
                this.resetUIState = function () {
                    this.scope.contextLabel = 'Analytics App';
                    this.scope.deleteEnabled = false;
                    this.scope.shareEnabled = false;
                    this.scope.analysisEnabled = false;
                    this.scope.filterEnabled = false;
                    this.scope.commentEnabled = false;
                    this.scope.saveEnabled = false;
                    this.scope.showGridToggle = false;
                    this.scope.createDatasetEnabled = localModel.layout == 'dashBoard';
                    this.scope.downloadEnabled = false;
                    this.scope.featuresEnabled = false;
                    this.scope.predictionsEnabled = false;
                };
            };

            var AnalyticStrategy = function () {
                this.applyUIState = function () {
                    AnalyticStrategy.prototype.applyUIState.apply(this);
                    var permissions = localModel.selectedItem.permissions;
                    this.scope.deleteEnabled = permissions.indexOf('DELETE') !== -1;
                    this.scope.shareEnabled = permissions.indexOf('SHARE') !== -1;
                    this.scope.commentEnabled = permissions.indexOf('COMMENT') !== -1;
                };
            };

            var DataSetStrategy = function () {
                this.applyUIState = function () {
                    var permissions = localModel.selectedItem.permissions;
                    DataSetStrategy.prototype.applyUIState.apply(this);
                    this.scope.deleteEnabled = permissions.indexOf('DELETE') !== -1;
                    this.scope.downloadEnabled = permissions.indexOf('RAW-DATA') !== -1;
                    this.scope.featuresEnabled = localModel.layout == 'dataSet' && permissions.indexOf('ANALYZE') !== -1;
                    this.scope.predictionsEnabled = localModel.layout == 'dataSet' && permissions.indexOf('ANALYZE') !== -1;
                    this.scope.shareEnabled = permissions.indexOf('SHARE') !== -1;
                    this.scope.commentEnabled = permissions.indexOf('COMMENT') !== -1;
                    this.scope.analysisEnabled = localModel.layout == 'dataSet' && permissions.indexOf('ANALYZE') !== -1 && localModel.selectedItem.headers != null;
                    this.scope.filterEnabled = localModel.layout == 'dataSet' && permissions.indexOf('EDIT') !== -1;
                    // EDIT permission is in Spec
                    this.scope.saveEnabled = localModel.layout == 'dataSet' && permissions.indexOf('EDIT') !== -1;
                };
            };

            var EmptySelectionStrategy = function () {
                this.applyUIState = function () {
                    EmptySelectionStrategy.prototype.applyUIState.apply(this);
                };
            };


            EmptySelectionStrategy.prototype = DataSetStrategy.prototype = AnalyticStrategy.prototype = new AbstractStrategy($location, $scope);

            var analyticStrategy = new AnalyticStrategy();
            var dataSetStrategy = new DataSetStrategy();
            var emptySelectionStrategy = new EmptySelectionStrategy();

            var concreteStrategy = {};


            this.onContextChanged = function () {

                if (localModel.selectedItem == null) {
                    concreteStrategy = emptySelectionStrategy;
                } else if (localModel.selectedItem.type === 'dataset') {
                    concreteStrategy = dataSetStrategy;
                } else if (localModel.selectedItem.type === 'analysis') {
                    concreteStrategy = analyticStrategy;
                }

                concreteStrategy.resetUIState();
                concreteStrategy.applyUIState();
            };


            $scope.$on('infoUpdate', function (event, selectedItem) {
                localModel.selectedItem = selectedItem;
                that.onContextChanged();
            });

            $scope.$on('layoutChanged', function (event, layout) {
                localModel.layout = layout;
                that.onContextChanged();
            });

            $scope.$on('headersLoaded', function (event, headers) {
                localModel.headers = headers;
                that.onContextChanged();
            });

            $scope.$on('AnItemChanged', function () {
                that.onContextChanged();
            });

            $scope.$on('featuresChanged', function (event, features) {
                localModel.features = features;
                that.onContextChanged();
            });

            this.lookUp = function () {
                return concreteStrategy;
            };

        };

        var serviceLocator = new ServiceLocator($location, $scope, $modal);

        serviceLocator.onContextChanged();


        $scope.showSidebar = _showSideBar;

        $scope.userEmail = Auth.getUserEmail();


        $scope.onSignOutClick = function () {
            serviceLocator.lookUp().onSignOutClick();
        };

        $scope.statistics = {
            onCorrelationClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/correlation_dialog.html',
                    backdrop: 'static',
                    controller: 'CorrelationCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },

            onKMeansClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/k_mean_dialog.html',
                    backdrop: 'static',
                    controller: 'KMeansCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },
            onLinRegrClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/linear_regression_dialog.html',
                    backdrop: 'static',
                    controller: 'LRegrCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },
            onLogRegrClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/logistic_regression_dialog.html',
                    backdrop: 'static',
                    controller: 'LogRegrCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },
            onSumStatClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/summary_statistic_dialog.html',
                    backdrop: 'static',
                    controller: 'SumStatCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },
            onSVMClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/svm_dialog.html',
                    backdrop: 'static',
                    controller: 'SVMCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },
            onNBayesClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/naive_bayes_dialog.html',
                    backdrop: 'static',
                    controller: 'NBayesCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },
            onDTreeClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/decision_tree_dialog.html',
                    backdrop: 'static',
                    controller: 'DTreeCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            },
            onRForestClick: function () {
                $modal.open({
                    templateUrl: 'html/dialogs/random_forest_dialog.html',
                    backdrop: 'static',
                    controller: 'RForestCtrl',
                    resolve: {
                        selectedItem: function () {
                            return localModel.selectedItem
                        }
                    }
                });
            }
        };

        $scope.onDownloadClick = function () {
            Datasets.download(localModel.selectedItem.id);
        };

        $scope.onPredictionsClick = function () {
            $modal.open({
                templateUrl: 'html/dialogs/prediction_dialog.html',
                backdrop: 'static',
                controller: 'PredictionCtrl',
                resolve: {
                    selectedItem: function () {
                        return localModel.selectedItem
                    }
                }
            });
        };

        $scope.toDashBoard = function () {
            $location.path('dashboard');
        };

        $scope.import = function () {
            $modal.open({
                templateUrl: 'html/dialogs/import_dialog.html',
                controller: 'ImportCtrl'
            });
        };

        $scope.onDeleteClick = function () {
            $modal.open({
                templateUrl: 'html/dialogs/delete_dialog.html',
                size: 'sm',
                backdrop: 'static',
                controller: 'DeleteCtrl',
                resolve: {
                    selectedItem: function () {
                        return localModel.selectedItem;
                    }
                }
            });
        };

        $scope.onShareClick = function () {
            $modal.open({
                templateUrl: 'html/dialogs/share_dialog.html',
                backdrop: 'static',
                controller: 'ShareCtrl',
                resolve: {
                    selectedItem: function () {
                        return localModel.selectedItem;
                    }
                }
            });
        };

        $scope.onCommentClick = function () {
            $modal.open({
                templateUrl: 'html/dialogs/comment_dialog.html',
                controller: 'CommentCtrl',
                resolve: {
                    selectedItem: function () {
                        return localModel.selectedItem;
                    }
                }
            });
        };

        $scope.onFilterClick = function () {
            var filterModal = $modal.open({
                templateUrl: 'html/dialogs/filter_dialog.html',
                controller: 'FilterCtrl',
                resolve: {
                    headers: function () {
                        return localModel.headers;
                    }
                }
            });
        };

        $scope.onFeaturesAddClick = function () {
            var featureModal = $modal.open({
                templateUrl: 'html/dialogs/feature_dialog.html',
                controller: 'FeatureCtrl',
                resolve: {
                    headers: function () {
                        return localModel.headers;
                    }
                }
            });
        };

        $scope.onFeaturesDeleteClick = function () {
            var featureModal = $modal.open({
                templateUrl: 'html/dialogs/feature_delete_dialog.html',
                controller: 'FeatureDeleteCtrl',
                resolve: {
                    features: function () {
                        return localModel.features;
                    }
                }
            });
        };

        $scope.onSaveClick = function () {
            $modal.open({
                templateUrl: 'html/dialogs/save_dialog.html',
                scope: $scope,
                size: 'sm',
                backdrop: 'static',
                controller: 'SaveCtrl'
            });
        };

        $scope.$watch('showSidebar', function (newVal, oldVal) {
            if (_showSideBar !== newVal) {
                _showSideBar = newVal;
                $rootScope.$broadcast('infoPanelEvent', {show: _showSideBar === 1});
            }
        });
        console.log('NavBarCtrl');

    }]);
})(angular);
