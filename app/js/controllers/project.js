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
        orderProp: 'name',
        // A task view of 'true' displays all tasks that are complete
        // a view of 'false' displays all active tasks
        // and a view of '' displays tasks of both complete and active
        taskView: 'false'
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

        var l = $scope.tasks.length,
            c = $scope.completedTasks(l);

        $scope.state.completion = Math.floor(c / l * 100) || 0; 
        // $scope.state.completion = Math.ceil(Math.random() * 100);
        $scope.state.totalHours = Math.ceil(Math.random() * 30);
    };

    $scope.completedTasks = function(l){
        var total = 0;
        for(var i=0; i < l; i++){
            if($scope.tasks[i].complete) total += 1;
        }
        return total;
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
                priority: 1,
                complete:false
            };

            params['key'] = 'none';
            $scope.tasks.push(params);

            Task.create(params, function(data){
                // update the tasks key with the one from the server when we get it
                params.key = data.task_key



                if(params.complete){
                    // if someone clicked the complete button before the server returned
                    // the key, then we need to do the edit inside the callback
                    // that returns the key when its available
                    // unlikely to happen, but you never know if the server hangs
                    Task.edit(params.key, {
                        'complete': true
                    }, function(data){
                        console.log(data);
                    });
                }
                if(params.toDelete){
                    console.log(params.toDelete)
                    // if someone clicked the button to delete this task before the 
                    // server returned the key.
                    Task.remove(params.key, function(data){
                        console.log(data);
                    });
                }


            });

            $scope.taskname = '';

            // $scope.state.creating = false;
        }
        
    };

    $scope.completeTask = function(task, i){
        // Animate and update in scope model immediately
        // Update on server in the background
        $scope.changeTask(task, i, true, 'to-complete');
    };

    $scope.reactivateTask = function(task, i){
        $scope.changeTask(task, i, false, 'to-reactivate');
    };

    $scope.toggleCompleteTask = function(task, i){
        if(task.complete){
            $scope.reactivateTask(task, i);
        }
        else{
            $scope.completeTask(task, i)
        }
    }

    $scope.deleteTask = function(task,i){
        // Animate and remove from scope model immediately
        // Remove from server in the background
        $('.task-item').eq(i).addClass('to-delete');

        $timeout(function(){
            // remove the task from the scope.tasks
            for (var i = 0; i < $scope.tasks.length; i++) {
                if ($scope.tasks[i] === task){
                    $scope.tasks.splice(i, 1);
                    break;
                }
            };
            $scope.recalculateCompletion();
        },500);

        if(task.key === 'none'){
            console.log("cant delete just this second");
            // mark the task to be deleted
            task.toDelete = true;
        }
        else{        
            Task.remove(task.key, function(data){
                console.log(data);
            });
        }
    };

    $scope.changeTask = function(task, i, val, classVal){
        // should wait until all edits have stopped for at least 2 seconds
        // to remove the spaces, and actually commit the changes.
        // User could be trying to click through multiple, and removing
        // from the list shifts the elements around and kills animations.
        $('.task-item').eq(i).addClass(classVal);
        $timeout(function(){
            task.complete = val;
            $scope.recalculateCompletion();
        },1000);
        
        if(task.key === 'none'){
            // this is a task that hasnt had its key returned from the server yet.
            // should instead wait for the key to come back, and then send
            // the edit.

            // All of that logic is handled inside the create function
            console.log(task);
        }
        else{
            Task.edit(task.key, {
                'complete': val
            }, function(data){
                console.log(data);
            });
        }
    };


    $scope.swipeTest = function(task){
        console.log(task);
        alert("Swiped it");
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