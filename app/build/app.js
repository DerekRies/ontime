


// Declare app level module which depends on filters, and services

angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui']).
  config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {
        templateUrl: '/partials/partial1.html', 
        controller: DashboardCtrl
    });
    // $routeProvider.when('/view2', {templateUrl: 'app/partials/partial2.html', controller: TrackerCtrl});

    $routeProvider.when('/project/:name', {
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

    $routeProvider.otherwise({redirectTo: '/'});

  }]).run( function($rootScope){

    console.log("Rootscope running");

    $rootScope.$on('projectAddedEmit', function(e, args){
        $rootScope.$broadcast('projectAdded', args);
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
            console.log("getting Project " + id);
            $http.get('/projects/' + id).success(function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            }).
            error(function(data){
                $location.path("/");
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
function openTimers(){
    // $('#timer-bar').css('bottom','0px'); 
    $('#timer-bar').addClass('up');
}

function closeTimers(){
    $('#timer-bar').removeClass('up');
    // $('#timer-bar').css('bottom','-300px'); 
}


function CreateProjectCtrl( $scope, $location, Project ) {

    $scope.settings = {
        viewable: true,
        editable: false
    };

    $scope.create = {
        'text': 'Create!',
        'loading': false
    }

    $scope.createProject = function(){
        if($scope.validate()){

            $scope.createLoad();
            var tags = '';

            if($scope.projectTags){
                tags = $scope.projectTags.replace(/\ +/g," "); // remove multiple spaces
                tags = tags.replace(/\,\ */g,","); // remove spaces between tags
                tags = tags.split(',');

            }

            var newproject = {
                'name':        $scope.projectName, 
                'description': $scope.projectDescription,
                'tags':        tags,
                'viewable':    $scope.settings.viewable,
                'editable':    $scope.settings.editable
            };

            console.log(tags);
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

}

CreateProjectCtrl.$inject = ['$scope', '$location' ,'Project'];

function DashboardCtrl( $scope ) {

}

DashboardCtrl.$inject = ['$scope'];

function HelpCtrl( $scope ) {

}

HelpCtrl.$inject = ['$scope'];

function ProfileCtrl( $scope, $route, $routeParams ) {
    
}

ProfileCtrl.$inject = ['$scope','$route', '$routeParams'];

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

function SettingsCtrl( $scope ) {

}

SettingsCtrl.$inject = ['$scope'];

function SidebarCtrl( $scope, $location, $timeout, Project ) {

    // Handles all the logic for the sidebar on every single page
    // that displays the projects available to the user

    $scope.$on('projectAdded', function(e,args){
        console.log("side bar got the event");
        var newproject = {"name":args.name};
        $scope.projects.push(newproject);
        $timeout(function(){
            $scope.chooseProject(newproject);
        },500);
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
        $scope.activeProject = project;
        $location.path('/project/' + project.name);
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