


// Declare app level module which depends on filters, and services

angular.module('myApp', 
    ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui']).
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
  .directive('markdown', function(){
      var converter = new Showdown.converter();
      var link = function(scope, element, attrs, model) {
        
          var render = function(){     
              if(model.$modelValue){
                var htmlText = converter.makeHtml(model.$modelValue);
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
  });

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);


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
                $location.path("/ohno");
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
                $scope.createFinish();
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