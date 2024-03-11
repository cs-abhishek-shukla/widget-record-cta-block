/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
"use strict";
(function () {
  angular
    .module("cybersponse")
    .controller("recordCtaBlock101Ctrl", recordCtaBlock101Ctrl);
  recordCtaBlock101Ctrl.$inject = ['$scope', 'config', 'currentPermissionsService', 'PagedCollection', 'appModulesService', '$state', '$filter', '_', '$rootScope', 'Query', 'websocketService'];
  function recordCtaBlock101Ctrl($scope, config, currentPermissionsService, PagedCollection, appModulesService, $state, $filter, _, $rootScope, Query, websocketService) {
    var subscription;
    $scope.getList = getList;
    $scope.openRecord = openRecord;
    $scope.config = angular.copy(config);
    $scope.$on('websocket:reconnect', function () {
      initWebsocket();
    });
    $scope.$on('$destroy', function () {
      if (subscription) {
        // Unsubscribe
        websocketService.unsubscribe(subscription);
      }
    });
    function init() {
      $scope.modulePermissions = currentPermissionsService.getPermission($scope.config.module);
      if (!$scope.modulePermissions.read) {
        $scope.unauthorized = true;
        return;
      }
      _setCardColors();
      $scope.getList();
      initWebsocket();
    }

    function getList() {
      $scope.processing = true;
      var pagedCollection = new PagedCollection(
        $scope.config.module,
        null,
        {
          $limit: $scope.config.query.limit
        }
      );
      $scope.config.query.__selectFields = _.values($scope.config.mapping);
      pagedCollection.query = new Query($scope.config.query);
      pagedCollection
        .loadGridRecord()
        .then(function () {
          $scope.fieldRows = pagedCollection.fieldRows;
          $scope.processing = false;
          initWebsocket();
        }, angular.noop)
        .finally(function () {
          $scope.processing = false;
        });
    }

    function openRecord(module, id) {
      var state = appModulesService.getState(module);
      var params = {
        module: module,
        id: $filter("getEndPathName")(id),
        previousState: $state.current.name,
        previousParams: JSON.stringify($state.params),
      };
      $state.go(state, params);
    }

    function _setCardColors() {
      var theme = $rootScope.theme;
      $scope.cardTilesThemeColor = {};
      if (theme.id === "light") {
        $scope.cardTilesThemeColor.cardBackgroundColor = "#fff";
        $scope.cardTilesThemeColor.recordStatusColor = "#0D9BE3";
        $scope.cardTilesThemeColor.cardIconSeparator = "#eeeeee";
      } else if (theme.id === "steel") {
        $scope.cardTilesThemeColor.cardBackgroundColor = "#fff";
        $scope.cardTilesThemeColor.recordStatusColor = "#22a6af";
        $scope.cardTilesThemeColor.cardIconSeparator = "#29323e";
      } else {
        $scope.cardTilesThemeColor.cardBackgroundColor = "#fff";
        $scope.cardTilesThemeColor.recordStatusColor = "#2cafc3";
        $scope.cardTilesThemeColor.cardIconSeparator = "#262626";
      }
    }

    function initWebsocket() {
      websocketService.subscribe($scope.config.module, function (data) {
        $scope.getList();
      }).then(function (data) {
        subscription = data;
      });
    }

    init()
  }
})();
