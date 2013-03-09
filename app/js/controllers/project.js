'use strict';

function ProjectDetailsCtrl($scope, 
                            $route, 
                            $routeParams, 
                            $timeout, 
                            Project, 
                            $filter, 
                            $location,
                            Task
) {

    $scope.project = {};
    $scope.projectClean = {};

    $scope.state = {
        loading: true,
        editing: false,
        creating: false,
        completion: 0,
        totalHours: 0,
        orderProp: 'name'
    }

    $('.tooltips').tooltip({
        placement:"bottom",
        delay: { show: 500 },
        animation:false
    });

    Project.get($routeParams.id, function(data){
        document.title = $filter('inflector')(data.project.name) + " | onTime";
        $scope.project = data.project;
        $scope.tasks = data.tasks;
        angular.copy($scope.project, $scope.projectClean);
        $scope.state.loading = false;
        $timeout(function(){
            $scope.recalculateCompletion();
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

        // HACKISH SOLUTION: The directive only renders content when
        // it is visible and on changes of the model its watching.
        // In this case the model gets modified, and then made visible
        // so it never has a chance to re-render until a new page is loaded
        // This line changes the model subtly when it becomes visible
        // forcing a directive render.
        $scope.project.description += ' ';

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
        $scope.state.completion = Math.ceil(Math.random() * 100);
        $scope.state.totalHours = Math.ceil(Math.random() * 30);
    };

    $scope.openNewTask = function(){
        $scope.state.creating = true;
        // focus the task name field
    };

    $scope.addTask = function(){
        if($scope.taskname.length >= 1){
            var params = {
                projectKey: $routeParams.id,
                name: $scope.taskname,
                category: '',
                priority: 1
            };

            params['key'] = 'none';
            $scope.tasks.push(params);

            Task.create(params, function(data){
                // update the tasks key with the one from the server when we get it
                params.key = data.task_key
            });

            $scope.taskname = '';

            // $scope.state.creating = false;
        }
        
    };

    $scope.completeTask = function(task, i){
        // Animate and update in scope model immediately
        // Update on server in the background
        $('.task-item').eq(i).addClass('to-complete');
    };

    $scope.deleteTask = function(task,i){
        // Animate and remove from scope model immediately
        // Remove from server in the background
        $('.task-item').eq(i).addClass('ui-animate');
    };


}

ProjectDetailsCtrl.$inject = [
    '$scope',
    '$route', 
    '$routeParams', 
    '$timeout', 
    'Project', 
    '$filter', 
    '$location',
    'Task' 
];