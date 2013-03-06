'use strict';

function ProjectDetailsCtrl($scope, 
                            $route, 
                            $routeParams, 
                            $timeout, 
                            Project, 
                            $filter, 
                            $location 
) {

    $scope.completion = 0;
    $scope.loading = true;

    Project.get($routeParams.id, function(data){
        document.title = $filter('inflector')(data.project.name) + " | onTime";
        $scope.project = data.project;
        $scope.loading = false;
        $timeout(function(){
            $scope.completion = Math.ceil(Math.random() * 100);
        },350);
    });

    $scope.deleteMe = function(){
        if(confirm("Are you sure you want to delete this project?")){
            Project.remove($routeParams.id, function(data){
                $scope.$emit('projectDeletedEmit', {id: $routeParams.id});
            });
        }
    };

    $scope.recalculateCompletion = function(){
        $scope.completion = Math.ceil(Math.random() * 100);
    };


}

ProjectDetailsCtrl.$inject = [
    '$scope',
    '$route', 
    '$routeParams', 
    '$timeout', 
    'Project', 
    '$filter', 
    '$location' 
];