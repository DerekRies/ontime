'use strict';

/* Services */

angular.module('myApp.services', ['ngResource']).
  factory('Project', function($http, $location){
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
