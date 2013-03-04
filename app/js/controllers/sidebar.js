'use strict';

function SidebarCtrl( $scope, $location, $timeout, Project ) {

    // Handles all the logic for the sidebar on every single page
    // that displays the projects available to the user

    $scope.loadProjects = function(){
        $scope.loading = {
            finished: true
        }

        $scope.projects = [
            {title: "Project One", dl: "15 hours" },
            {title: "Project Two", dl: "15 hours" },
            {title: "Project Three", dl: "13 hours" },
            {title: "Project Four", dl: "19 hours" },
            {title: "Project Five", dl: "28 hours" },
            {title: "Project Six", dl: "1 hours" }
        ];

        Project.getAll(function(data){
            console.log(data);
        });

        $scope.activeProject;
    };

    $scope.chooseProject = function(project){
        $scope.activeProject = project;
        $location.path('/project/' + project.title);
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

        $scope.activeProject == undefined;
        $location.path('/create');
    };

    $scope.loadProjects();

}

SidebarCtrl.$inject = ['$scope', '$location', '$timeout', 'Project'];