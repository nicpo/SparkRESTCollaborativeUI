angular.module("anDirectives").directive('commentsThread', ['Comments', '$compile', 'Info', 'Auth', function (Comments, $compile, Info, Auth) {
    return {
        restrict: 'EA',
        templateUrl: 'html/comments_thread.html',
        scope: {
            comments: '=comments',
            replyEnabled:'=replyEnabled'
        },
        link: function (scope, element, attr, ngModel) {
            scope.username = Auth.getUserEmail();

            scope.reply = function (text) {
                Comments.save({
                    text: text,
                    reference: scope.comments[0].id,
                    dataset: scope.comments[0].dataset
                }).then(function (data) {
                    scope.comments.push(data);
                    scope.replyText = '';
                });
            };

            scope.update = function (comment) {
                Comments.update(comment.id, comment, function (data) {

                });
            };

            scope.delete = function (comment) {
                Comments.delete(comment.id).then(function () {
                    var index = scope.comments.indexOf(comment);
                    if (index === 0) {
                        Info.deleteThread(scope.comments);
                    } else {
                        scope.comments.splice(scope.comments.indexOf(comment), 1);
                    }

                });
            };
        }
    };
}])
    .directive('commentable', ['$compile', '$position', '$rootScope', '$document', 'Comments', 'Info', '$parse', function ($compile, $position, $rootScope, $document, Comments, Info, $parse) {
        return {
            restrict: 'A',
            scope: {
                threads: '=commentableThreads',
                commentableName: '&',
                commentableEnabled: '=commentableEnabled'
            },
            link: function (scope, element, attrs) {

                var tooltipTemplate = '<div class="comments-popup"><form ng-if="commentableEnabled" class="comment-new-block" ng-submit="newComment()"><textarea placeholder="New comment..." ng-model="text" rows="3"></textarea>' +
                        '<input type="submit" class="btn btn-sm btn-default" value="Comment"></form>' +
                        '<comments-thread ng-repeat="thread in threads" comments="thread" reply-enabled="commentableEnabled"/></div>',
                    indicator = angular.element('<div aria-hidden="true" class="an-cmt-ico"></div>'),
                    tooltip;

                element.bind('click', elementClicked);

                indicator.bind('click', function (event) {
                    if (tooltip && tooltip.parent().length) {
                        hide();
                        event.stopPropagation();
                        return;
                    }
                    elementClicked();
                    show();
                    event.stopPropagation();
                });

                element.addClass('commentable');
                if (attrs.commentable === 'section')
                    element.find('label').prepend(indicator);
                else element.append(indicator);

                scope.$watch(function () {
                    return scope.threads;
                }, function (value) {
                    if (value)
                        element.addClass('has-comments');
                    else if (!value)
                        element.removeClass('has-comments');
                });

                $rootScope.$on('commentsHide', function () {
                    hide();
                });

                scope.newComment = function () {
                    var comment = {
                        text: scope.text,
                        target: angular.toJson({
                            type: attrs.commentable,
                            name: scope.commentableName()
                        })
                    };
                    comment[Info.getContext().type] = Info.getContext().id;
                    Comments.save(comment).then(function (data) {
                        scope.text = '';
                        Info.addCommentThread([data]);
                    });
                };

                function elementClicked(event) {
                    $rootScope.$broadcast('commentsHide');
                    element.addClass('active');
                    $document.bind('click', outsideClick);
                    event && event.stopPropagation();
                }

                function outsideClick(event) {
                    var curEl = event.target;
                    while (curEl.parentNode) {
                        if (angular.element(curEl).hasClass('comments-popup'))
                            return;
                        curEl = curEl.parentNode;
                    }
                    hide();
                }

                function show() {
                    tooltip = $compile(tooltipTemplate)(scope);
                    $document.find('body').append(tooltip);
                    setPosition();
                }

                function hide() {
                    if (tooltip)
                        tooltip.remove();
                    element.removeClass('active');
                    $document.unbind('click', outsideClick);
                }

                function setPosition() {
                    var position = $position.positionElements(indicator, tooltip, 'bottom', true);
                    position.top += 'px';
                    position.left += 'px';
                    position.position = 'absolute';
                    tooltip.css(position);
                }
            }
        };
    }]);
