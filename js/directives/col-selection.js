angular.module("anDirectives").directive("anColSelection", function(){
    return {
        restrict: 'E',
        replace:true,
        templateUrl: 'html/colselection.html'
    }
});