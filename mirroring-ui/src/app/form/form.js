(function () {
	"use strict";

	var formModule = angular.module('form-module', [
    'form-general-module', 'form-timing-module',
    'form-summary-module', 'progress-bar-module',
    'dataset-model-module', 'validation-module'
  ]);

	formModule.controller('FormCtrl', [ "$scope", "$state", "$timeout", "datasetModel", "ValidationSvc",
                                      function($scope, $state, $timeout, datasetModel, ValidationSvc) {

    $timeout(function () { angular.element('body').removeClass('preload'); }, 1000);

    $scope.validation = ValidationSvc;
    $scope.model = datasetModel;

    $scope.save = function () {
      console.log("bar = " + $scope.foo.bar);
      console.log("baz = " + $scope.foo.baz);
    };


    $scope.isActive = function(route) {
      return $state.current.name === route;
    };

    $scope.goNext = function (formInvalid, stateName) {

      console.log();

/*
      SpinnersFlag.show = true;

      if (!validationService.nameAvailable || formInvalid) {
        validationService.displayValidations.show = true;
        validationService.displayValidations.nameShow = true;
        SpinnersFlag.show = false;
        return;
      }
      validationService.displayValidations.show = false;
      validationService.displayValidations.nameShow = false;
*/
      if (formInvalid) {
        $scope.validation.show = true;
      } else {
        $state.go(stateName);
      }




    };
    $scope.goBack = function (stateName) {
/*      SpinnersFlag.backShow = true;
      validationService.displayValidations.show = false;
      validationService.displayValidations.nameShow = false;*/
      $state.go(stateName);
    };

    $scope.$on('$destroy', function () {
      $timeout(function () { angular.element('body').addClass('preload'); }, 300);
    });

  }]);

})();