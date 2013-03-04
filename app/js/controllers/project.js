'use strict';

function ProjectDetailsCtrl( $scope, $route, $routeParams ) {
    if($routeParams.name === undefined){
        $scope.title = "All Projects";
    }
    else{
        $scope.title = $routeParams.name;
        document.title = "onTime - " + $scope.title;
    }

}

ProjectDetailsCtrl.$inject = ['$scope','$route', '$routeParams'];