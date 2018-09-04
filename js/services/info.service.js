app.service('Info', ['$rootScope', 'Comments', function ($rootScope, Comments) {
    var info = this;
    var context = null;

    info.getContext = function () {
        return context;
    };


    $rootScope.$on('CommentAdded', function () {
        refreshCommentsList();
    });

    var refreshCommentsList = function () {
        if (context.type === 'dataset') {
            Comments.getForDataset(context.id).then(commentsSuccess);
        } else if (context.type === 'analysis') {
            Comments.getForAnalysis(context.id).then(commentsSuccess);
        }

        function commentsSuccess(data) {
            if (context !== null) {
                context.commentThreads = [];
                data.forEach(function (comment) {
                    if (!comment.reference) {
                        context.commentThreads.push([comment]);
                        return;
                    }
                    context.commentThreads.forEach(function (thread) {
                        if (comment.reference === thread[0].id)
                            thread.push(comment);
                    });
                });
            }
            $rootScope.$broadcast('commentsUpdated');
        }
    };

    info.setContext = function (newContext) {
        context = newContext;
        if (newContext == null) {
            $rootScope.$broadcast('infoUpdate', null);
            $rootScope.$broadcast('commentsUpdated');
            return;
        }
        $rootScope.$broadcast('infoUpdate', context.item);
        refreshCommentsList();
    };

    info.getTargetedThreads = function () {
        var groupedThreads = {};
        if (context == null || !context.commentThreads)
            return [];
        context.commentThreads.forEach(function (thread) {
            if (!thread[0].target)
                return;
            var target = angular.fromJson(thread[0].target);
            if (!groupedThreads[target.name])
                groupedThreads[target.name] = [thread];
            else groupedThreads[target.name].push(thread);
        });
        return groupedThreads;
    };

    info.addCommentThread = function (thread) {
        context.commentThreads.push(thread);
        $rootScope.$broadcast('commentsUpdated');
    };

    info.deleteThread = function (thread) {
        context.commentThreads.splice(context.commentThreads.indexOf(thread), 1);
        $rootScope.$broadcast('commentsUpdated');
    };

    info.setDatasetContext = function (dataset) {

        if (dataset === null) {
            info.setContext(null);
            return;
        }

        var item = dataset;
        info.setContext({
            header: item.name,
            type: 'dataset',
            id: item.id,
            description: item.description,
            item: item,
            view: {}
        });
    };

    info.setAnalysisContext = function (analysis) {

        info.setContext({
            header: analysis.name,
            type: 'analysis',
            description: analysis.description,
            id: analysis.id,
            item: analysis
        });
    };


    info.setLayout = function (val) {
        $rootScope.$broadcast('layoutChanged', val);
    };

    info.setItem = function (item) {
        context.item = item;
    };

    info.getItem = function () {
        return context.item;
    };

    info.setView = function (view) {
        context.view = view;
    };

    info.getView = function () {
        return context.view;
    };


    var datasetCommentsQueue = [];
    var analysisCommentsQueue = [];
    var DatasetCommentsLoader = function (queue) {
        var item;
        var next = function () {
            item = queue[0];
            if (!item) {
                return;
            }
            Comments.getForDataset(item.id).then(onSuccess);
        };

        var onSuccess = function (data) {
            if (queue != datasetCommentsQueue) {
                return;
            }
            item.hasComment = data != null && data.length !== 0;
            queue.shift();
            next();
        };
        next();
    };
    var AnalysisCommentsLoader = function (queue) {
        var item;
        var next = function () {
            item = queue[0];
            if (!item) {
                return;
            }
            Comments.getForAnalysis(item.id).then(onSuccess);
        };

        var onSuccess = function (data) {
            if (queue != analysisCommentsQueue) {
                return;
            }
            item.hasComment = data != null && data.length !== 0;
            queue.shift();
            next();
        };
        next();
    };

    info.loadComments = function (items, type) {
        if (items.length === 0) {
            return;
        }

        if (type === 'dataset') {
            datasetCommentsQueue = [];
            items.forEach(function (item) {
                datasetCommentsQueue.push(item);
            });
            new DatasetCommentsLoader(datasetCommentsQueue);

        } else {
            analysisCommentsQueue = [];
            items.forEach(function (item) {
                analysisCommentsQueue.push(item);
            });
            new AnalysisCommentsLoader(analysisCommentsQueue);

        }

    };


}]);