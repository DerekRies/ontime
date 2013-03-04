'use strict';

function CreateProjectCtrl( $scope, Project ) {

    $scope.createProject = function(){
        Project.create({
            'name':$scope.projectName, 
            'description':$scope.projectDescription
        }, function(data){
            console.log(data);
            $scope.resetForm();
        });
    };

    $scope.resetForm = function(){
        $scope.projectName = '';
        $scope.projectTags = '';
        $scope.projectDescription = '';
    };

}

CreateProjectCtrl.$inject = ['$scope', 'Project'];