'use strict';

function ProjectDetailsCtrl( $scope, $route, $routeParams, $timeout, Project ) {
    $scope.completion = 0;
    if($routeParams.name === undefined){
        $scope.title = "All Projects";
    }
    else{
        $scope.title = $routeParams.name;
        document.title = "onTime - " + $scope.title;
    }

    $timeout(function(){
        $scope.completion = Math.ceil(Math.random() * 100);
    },500);


}

ProjectDetailsCtrl.$inject = ['$scope','$route', '$routeParams', '$timeout', 'Project'];