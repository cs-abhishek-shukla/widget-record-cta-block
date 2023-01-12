"use strict";
(function () {
  angular
    .module("cybersponse")
    .controller("editRecordCtaBlock100Ctrl", editRecordCtaBlock100Ctrl);

  editRecordCtaBlock100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'appModulesService', 'Entity'];
  function editRecordCtaBlock100Ctrl($scope, $uibModalInstance, config, appModulesService, Entity) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.loadAttributes = loadAttributes;
    function _init() {
      var _config = {
        mapping: {
          cardTitle: null,
          subtitle: null,
          recordResult: null,
          recordStatus: null
        }
      };
      $scope.config = { labelCTA: 'Review Setup', showIcon: 'icon icon-check' };
      angular.extend($scope.config, _config, config);
      appModulesService.load(true).then(function (modules) {
        $scope.modules = modules;
        if ($scope.config.module !== "") {
          loadAttributes();
        }
      });
    }
    function loadAttributes() {
      $scope.fields = [];
      $scope.fieldsArray = [];
      $scope.pickListFields = [];
      var entity = new Entity($scope.config.module);
      entity.loadFields().then(function () {
        for (var key in entity.fields) {
          if (entity.fields[key].type === "picklist") {
            $scope.pickListFields.push(entity.fields[key]);
          }
        }
        $scope.fields = entity.getFormFields();
        angular.extend($scope.fields, entity.getRelationshipFields());
        $scope.fieldsArray = entity.getFormFieldsArray();
      });
    }
    function cancel() {
      $uibModalInstance.dismiss("cancel");
    }

    function save() {
      if ($scope.editRecordCTABloackWidgetForm.$invalid) {
        $scope.editRecordCTABloackWidgetForm.$setTouched();
        $scope.editRecordCTABloackWidgetForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }
    _init();
  }
})();
