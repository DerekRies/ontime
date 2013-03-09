'use strict';


// Declare app level module which depends on filters, and services

angular.module('myApp', 
    ['myApp.filters', 'myApp.services', 'myApp.directives', 'ui', 'ngSanitize']).
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
