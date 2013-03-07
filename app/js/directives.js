'use strict';

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