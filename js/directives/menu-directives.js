angular.module("anDirectives").directive("anMenuItem", function(){
        return {
            restrict: 'E',
            scope:{
                itemClass:'@anClass',
                itemLabel:'@anLabel',
                itemSelected:'=anSelected'
            },
            replace:true,
            templateUrl: 'html/menuItem.html'
        }
    });