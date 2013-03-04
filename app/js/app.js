'use strict';


// Declare app level module which depends on filters, and services

angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui']).
  config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {
        templateUrl: '/partials/partial1.html', 
        controller: Ctrl1
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
