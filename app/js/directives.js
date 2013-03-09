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
});