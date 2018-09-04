angular.module("anDirectives", []);

angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comments_template.html", '<comments-thread ng-repeat="thread in threads" comments="thread" />');
}]);