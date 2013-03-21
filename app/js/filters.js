'use strict';

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
