'use strict';

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