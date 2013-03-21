


// Declare app level module which depends on filters, and services

angular.module('myApp', 
    ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui', 'ngSanitize', 'hmTouchevents']).
  config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {
        templateUrl: '/partials/partial1.html', 
        controller: DashboardCtrl
    });
    // $routeProvider.when('/view2', {templateUrl: 'app/partials/partial2.html', controller: TrackerCtrl});

    $routeProvider.when('/project/:id', {
        templateUrl: '/partials/details.html', 
        controller: ProjectDetailsCtrl
    });

    $routeProvider.when('/help', {
        templateUrl: '/partials/help.html', 
        controller: HelpCtrl
    });

    $routeProvider.when('/create', {
            templateUrl: '/partials/createproject.html', 
            controller: CreateProjectCtrl
    });

    $routeProvider.when('/settings', {
        templateUrl: '/partials/settings.html', 
        controller: SettingsCtrl
    });

    $routeProvider.when('/profile', {
        templateUrl: '/partials/profile.html', 
        controller: ProfileCtrl
    });

    $routeProvider.when('/ohno', {
        templateUrl: '/partials/notfound.html'
    })

    $routeProvider.otherwise({redirectTo: '/'});

  }])
  .run( function($rootScope){


    $rootScope.$on('projectAddedEmit', function(e, args){
        $rootScope.$broadcast('projectAdded', args);
    });

    $rootScope.$on('projectDeletedEmit', function(e, args){
        $rootScope.$broadcast('projectDeleted', args);
    });

    $rootScope.$on('projectNameChangeEmit', function(e, args){
        $rootScope.$broadcast('projectNameChange', args);
    });

  });


/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('coolFade', function() {

    return {

      compile: function(elm) {

        return function(scope, elm, attrs) {
          $(elm).addClass('in');
        };

      }

    }
})
  .directive('markdown', ['$sanitize', function($sanitize){
      var converter = new Showdown.converter();
      var link = function(scope, element, attrs, model) {
        
          var render = function(){
             // TODO: Find a better way to get scope properties that
             // are more than 1 level deep.
             // e.g. $scope.state.editing is 2 deep (state, and editing)
              var hiding = (eval('scope.'+attrs.ngHide));
              if(model.$modelValue && hiding !== true){
                var htmlText = converter.makeHtml(model.$modelValue);
                htmlText = $sanitize(htmlText);
                element.html(htmlText);
              } 
          };
          scope.$watch(attrs['ngModel'], render);
          if(isNaN(model.$modelValue) === false){
            render();
          }
      };
      return {
          restrict: 'E',
          require: 'ngModel',
          link: link
      }
  }])
 .directive('otFocus', function() {
    return function(scope, element, attrs) {
       scope.$watch(attrs.otFocus, 
         function (newValue) { 
            if(!newValue){
              scope[attrs.ngModel] = '';
              element[0].focus();
            }
         },true);
      };    
})
 .directive('timer', ['Task', function(Task){

    var template = "<div class='inline-timer pull-right'>" + 
      "<span class='timer-count'>{{test}}</span><br>" + 
        "<div class='pull-right'>" + 
            "<button class='btn btn-small'><i class='icon-play'></i></button><button class='btn btn-small'><i class='icon-stop'></i></button>" + 
        "</div>" + 
      "</div>";

    var link = function(scope, element, attrs, model){
      console.log(scope);
      console.log(attrs);
      console.log(model);

      var startTime,
          stopTime,
          timeLogged = 0,
          running = false;


      var startBtn = element.find('button')[0];
      var clearBtn = element.find('button')[1];

      angular.element(startBtn).bind('click', startTimer);

      angular.element(clearBtn).bind('click', stopTimer);

      function startTimer(){
        if(!running){
          running = true;
          startTime = +new Date();
        }
      }

      function stopTimer(){
        if(running){        
          running = false;
          stopTime = +new Date();
          timeLogged += (stopTime - startTime);
          console.log(timeLogged);
        }
      }


    };

    var compile = function(el, two){
      return link;
    };

    return {
      restrict: 'E',
      require: 'ngModel',
      link: link,
      compile: compile,
      template: template
    }
 }]);

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('stopwatch', function(){
    return function(one){
        var hours = Math.floor(one / 3600000);
        var minutes = Math.floor((one % 3600000) / 60000);
        var seconds = Math.floor((one % 60000) / 1000);
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        var time = hours + ":" + minutes + ":" + seconds;
        return time;
    }
  });


/* Services */

angular.module('myApp.services', ['ngResource']).
  factory('Project', function( $http, $location ){
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";

    return {
        get: function(id, callback){
            $http.get('/projects/' + id).success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){
                // $location.path("/ohno");
            });
        },
        getAll: function(callback){
            console.log("getting all projects");
            $http.get('/projects').success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){

            });
        },
        create: function(params, callback){
            console.log("creating Project");
            $http.post('/projects', $.param(params)).success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){
                console.log(data);
            });
        },
        edit: function(id,params,callback){
            console.log("editing Project");
            $http.put('/projects/'+id, $.param(params)).success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){
                console.log(data);
            });
        },
        remove: function(id,callback){
            $http({method: 'DELETE', url:'/projects/' + id})
            .success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){
                console.log(data);
            });
        }
    };
}).
factory('Task', function( $http, $location ){
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded";
    return {
        get: function(){
            // GET -> /task/:id
            // get a specific task
        },
        getAll: function(){
            // GET -> /task
            // get all tasks for this user
        },
        create: function(params,callback){
            // POST -> /task
            // POST add a new task to this project
            console.log("creating task");
            $http.post('/task', $.param(params)).success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){
                console.log("Theres been an error");
            });
        },
        edit: function(id, params, callback){
            // PUT -> /task/:id
            // PUT edit a specific task
            $http.put('/task/' + id, $.param(params)).success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){
                console.log("Theres been an error");
            });
        },
        remove: function(id, callback){
            // DELETE -> /task/:id
            // DELETE a specific task
            console.log(id);
            $http({method:'DELETE', url:'/task/' + id})
            .success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){

            });
        }
    }
});
var TIMER_OPEN = false;
function openTimers(){
// $('#timer-bar').css('bottom','0px'); 
$('#timer-bar').addClass('up');
TIMER_OPEN = true;
}
function closeTimers(){
$('#timer-bar').removeClass('up');
// $('#timer-bar').css('bottom','-300px'); 
TIMER_OPEN = false;
}
function toggleTimers(){
TIMER_OPEN = !TIMER_OPEN;
if(TIMER_OPEN){
openTimers();
}
else{
closeTimers();
}
}


function CreateProjectCtrl( $scope, $location, Project ) {

    document.title = "Create Project | onTime";

    $scope.settings = {
        viewable: true,
        editable: false
    };

    $scope.create = {
        'text': 'Create!',
        'loading': false
    };

    $scope.preview = {
        enabled: false
    };



    $scope.validate = function(){
        if($scope.projectName === undefined || $scope.projectName === ''){
            return false;
        }
        else{
            return true;
        }
    };

    $scope.createLoad = function(){
        $scope.create.text = 'Creating...';
        $scope.create.loading = true;
    };

    $scope.createFinish = function(){
        $scope.create.text = 'Create!';
        $scope.create.loading = false;
    };

    $scope.resetForm = function(){
        $scope.projectName = '';
        $scope.projectTags = '';
        $scope.projectDescription = '';
        $scope.settings = {
            viewable: true,
            editable: false
        };
    };

    $scope.createProject = function(){
        if($scope.validate()){

            $scope.createLoad();

            var newproject = {
                'name':        $scope.projectName, 
                'description': $scope.projectDescription,
                'tags':        $scope.projectTags,
                'viewable':    $scope.settings.viewable,
                'editable':    $scope.settings.editable
            };

            console.log($scope.projectTags)
            Project.create(newproject, function(data){
                $scope.resetForm();
                // $scope.createFinish();
                newproject['key'] = data;
                $scope.$emit('projectAddedEmit', newproject);
            });
            

        }
        else{

        }
    };

    

}

CreateProjectCtrl.$inject = ['$scope', '$location' ,'Project'];

function DashboardCtrl( $scope ) {
    document.title = "Dashboard | onTime";
}

DashboardCtrl.$inject = ['$scope'];

function HelpCtrl( $scope ) {
    document.title = "Help | onTime";
}

HelpCtrl.$inject = ['$scope'];

function ProfileCtrl( $scope, $route, $routeParams ) {
    document.title = "My Profile | onTime";
}

ProfileCtrl.$inject = ['$scope','$route', '$routeParams'];

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


    $scope.startTimer = function(task){
        if(!task.timerRunning){
            console.log(task);
            task.timerStart = +new Date();
            task.timerRunning = true;
            task.real_timer = task.time_logged;
            $scope.updateTime(task);
        }
    };

    $scope.updateTime = function(task){
        $timeout(function(){
            if(task.timerRunning){
                task.time_logged += 1000;
                $scope.updateTime(task);
            }
        }, 1000);
    };

    $scope.stopTimer = function(task){
        if(task.timerRunning){
            task.timerRunning = false;
            task.timerStop = +new Date();
            task.time_logged = task.real_timer + (task.timerStop - task.timerStart);
            console.log(task.time_logged);
            Task.edit(task.key, {
                'time_logged': task.time_logged
            },
                function(data){
                    console.log(data);
                });
        }
    };

    $scope.clearTimer = function(task){
        task.timerRunning = false;
        task.time_logged = 0;
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

function SettingsCtrl( $scope ) {
    document.title = "Settings | onTime";
}

SettingsCtrl.$inject = ['$scope'];

function SidebarCtrl( $scope, $location, $timeout, Project ) {

    // Handles all the logic for the sidebar on every single page
    // that displays the projects available to the user

    $scope.$on('projectAdded', function(e,newproject){
        $scope.projects.push(newproject);
        console.log()
        $timeout(function(){
            $scope.chooseProject(newproject);
        },500);
    });

    $scope.$on('projectNameChange', function(e,project){
        
        console.log(project);
        $scope.getProjectById(project.id).name = project.name;
        
    });

    $scope.$on('projectDeleted', function(e,args){
        // remove the project with args.id from the $scope.projects list
        var l = $scope.projects.length;
        // could optimize this search by storing the index of item in the
        // array somewhere that the projects detail controller could access
        // it as well. Then just return the index on the projectDeleted event.
        var prev = 0;

        // this solution doesn't account for situations when angular is using
        // and displaying a different list of elements, sorted, filtered, or paginated.
        for(var i = 0; i < l ; i++){
            if($scope.projects[i].key === args.id){

                // want to animate the deletion of this element before removing it
                var el = $('.project-item').eq(i);
                el.addClass('ui-animate');
                $timeout(function(){
                    $scope.projects.splice(i,1);
                    if(i !== 0){
                        // choose the project right before this one
                        // unless its the first project, then use the default
                        // 0 index for the first item
                        prev = i - 1;
                    }
                    $scope.chooseProject($scope.projects[prev]);
                }, 600);
                
                break;
            }
        }
        
    });

    $scope.loadProjects = function(){
        $scope.loading = {
            finished: true
        }

        $scope.projects = [];

        Project.getAll(function(data){
            console.log(data);
            $scope.projects = data;
        });

        $scope.activeProject = undefined;
    };

    // Non cached old version  
    // $scope.getProjectById = function(id){
    //     // use a binary search if list is sorted by id/key
    //     // otherwise use a normal search

    //     // cache the results as well
    //     var l = $scope.projects.length;
    //     for(var i = 0; i < l ; i++){
    //         if($scope.projects[i].key === id){
    //             return $scope.projects[i];
    //         }
    //     }
    // };

    $scope.getProjectById = (function(){

        var cache = {};

        return function(id){
            var l = $scope.projects.length;
            var cached = cache[id];

            if(cached){
                // cache hit
                return cached;
            }

            // cache miss
            for(var i = 0; i < l ; i++){
                if($scope.projects[i].key === id){
                    cache[id] = $scope.projects[i];
                    return $scope.projects[i];
                }
            }
        };

    })();

    $scope.chooseProject = function(project){
        $scope.query = '';
        $scope.activeProject = project;
        $location.path('/project/' + project.key);
    };

    $scope.isActive = function(project){
        if($scope.activeProject == project){
            return true;
        }
        else{
            return false;
        }
    };

    $scope.createNewProject = function(){
        $scope.activeProject = undefined;
        $location.path('/create');
        // var name = prompt("What would you like to name this project?");
        // if(name){
        //     $scope.projects.push({"name":name,"dl":"none"});
        //     $timeout(function(){
        //         $location.path('project/' + name);
        //     }, 500);
        // }
    };

    $scope.loadProjects();

}

SidebarCtrl.$inject = ['$scope', '$location', '$timeout', 'Project'];