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
    $scope.project = {};
    $scope.projectClean = {};

    $scope.state = {
        loading: true,
        editing: false,
        creating: false
    }

    $('.tooltips').tooltip({
        placement:"bottom",
        delay: { show: 500 },
        animation:false
    });

    Project.get($routeParams.id, function(data){
        document.title = $filter('inflector')(data.project.name) + " | onTime";
        $scope.project = data.project;
        angular.copy($scope.project, $scope.projectClean);
        $scope.state.loading = false;
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

    $scope.startEdits = function(){
        $scope.state.editing = true;
    };

    $scope.saveEdits = function(){
        $scope.state.editing = false;
        console.log($scope.project.name);

        if($scope.project.name !== $scope.projectClean.name){
            $scope.$emit('projectNameChangeEmit', 
                {id: $routeParams.id, name: $scope.project.name});
        }


        // only send a request to edit if the data has changed
        angular.copy($scope.project, $scope.projectClean);
        Project.edit($routeParams.id, $scope.project, function(data){
            console.log(data);
        });
    };

    $scope.resetEdits = function(){
        angular.copy($scope.projectClean, $scope.project);
        $scope.state.editing = false;
    };

    $scope.recalculateCompletion = function(){
        $scope.completion = Math.ceil(Math.random() * 100);
    };

    $scope.completeTask = function(task){
        console.log(task);
        $('.task-item').eq(task).addClass('to-complete');
    };

    $scope.deleteTask = function(task){
        console.log(task);
        $('.task-item').eq(task).addClass('ui-animate');
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