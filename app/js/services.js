'use strict';

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