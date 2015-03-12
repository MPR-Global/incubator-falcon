/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /***
   * @ngdoc controller
   * @name app.controllers.feed.FeedController
   * @requires EntityModel the entity model to copy the feed entity from
   * @requires Falcon the falcon service to talk with the Falcon REST API
   */
  var clusterModule = angular.module('app.controllers.view', [ 'app.services' ]);

  clusterModule.controller('EntityDetailsCtrl', [
    "$scope", "$timeout", "$interval", "Falcon", "EntityModel", "$state", "X2jsService", 'EntitySerializer', 'InstanceFalcon',
    function ($scope, $timeout, $interval, Falcon, EntityModel, $state, X2jsService, serializer, InstanceFalcon) {

      $scope.entity = EntityModel;

      var resultsPerPage = 10;
      var visiblePages = 3;
      $scope.entityName = $scope.entity.name;
      $scope.entityType = $scope.entity.type;

      $scope.pages = [];
      $scope.nextPages = false;

      if($scope.entity.type === "feed"){
        $scope.feed = serializer.preDeserialize($scope.entity.model, "feed");
        $scope.feed.name = $scope.entity.name;
        $scope.feed.type = $scope.entity.type;
      }else{
        $scope.process = serializer.preDeserialize($scope.entity.model, "process");
        $scope.process.name = $scope.entity.name;
        $scope.process.type = $scope.entity.type;
      }

      $scope.capitalize = function(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
      };

      $scope.refreshInstanceList = function (type, name) {
        $scope.instancesList = [];
        changePagesSet(0, 0, 0);
      };

      var consultPage = function(offset, page, defaultPage){
        $scope.loading = true;
        InstanceFalcon.getInstances($scope.entityType, $scope.entityName, offset).then(function() {
          if (InstanceFalcon.data !== null) {
            $scope.pages[page] = {};
            $scope.pages[page].index = page;
            $scope.pages[page].data = InstanceFalcon.data.entity;
            $scope.pages[page].show = true;
            $scope.pages[page].enabled = true;
            $scope.pages[page].label = "" + ((offset/resultsPerPage)+1);
            if($scope.pages[page].data.length > resultsPerPage){
              offset = offset + resultsPerPage;
              $scope.nextPages = true;
              if(page < visiblePages-1){
                consultPage(offset, page+1, defaultPage);
              }else{
                $scope.goPage(defaultPage);
              }
            }else{
              $scope.nextPages = false;
              $scope.goPage(defaultPage);
            }
          }
        });
      };

      var changePagesSet = function(offset, page, defaultPage){
        $scope.pages = [];
        consultPage(offset, page, defaultPage);
      };

      $scope.goPage = function (page) {
        $scope.loading = true;
        $scope.pages.forEach(function(pag) {
          pag.enabled = true;
        });
        $scope.pages[page].enabled = false;
        $scope.instancesList = $scope.pages[page].data;
        if($scope.instancesList.length > resultsPerPage){
          $scope.instancesList.pop();
        }
        $scope.prevPages = parseInt($scope.pages[page].label) >  visiblePages ? true : false;
        Falcon.responses.listLoaded = true;
        $scope.loading = false;
        $timeout(function() {
          angular.element('#tagsInput').focus();
        }, 0, false);
      };

      $scope.changePagesSet = function(offset, page, defaultPage){
        changePagesSet(offset, page, defaultPage);
      };

      $scope.instanceDetails = function (instance) {
        EntityModel.model = instance;
        EntityModel.type = $scope.entity.type;
        EntityModel.name = $scope.entity.name;
        $state.go("instanceDetails");
      };

      $scope.resumeInstance = function (type, name, start, end) {
        Falcon.logRequest();
        Falcon.postResumeInstance(type, name, start, end)
            .success(function (message) {
              Falcon.logResponse('success', message, type);
              $scope.refreshInstanceList(type, name);
            })
            .error(function (err) {
              Falcon.logResponse('error', err, type);

            });
      };

      $scope.suspendInstance = function (type, name, start, end) {
        Falcon.logRequest();
        Falcon.postSuspendInstance(type, name, start, end)
            .success(function (message) {
              Falcon.logResponse('success', message, type);
              $scope.refreshInstanceList(type, name);
            })
            .error(function (err) {
              Falcon.logResponse('error', err, type);

            });
      };

      $scope.reRunInstance = function (type, name, start, end) {
        Falcon.logRequest();
        Falcon.postReRunInstance(type, name, start, end)
            .success(function (message) {
              Falcon.logResponse('success', message, type);
              $scope.refreshInstanceList(type, name);
            })
            .error(function (err) {
              Falcon.logResponse('error', err, type);

            });
      };

      $scope.killInstance = function (type, name, start, end) {
        Falcon.logRequest();
        Falcon.postKillInstance(type, name, start, end)
            .success(function (message) {
              Falcon.logResponse('success', message, type);
              $scope.refreshInstanceList(type, name);
            })
            .error(function (err) {
              Falcon.logResponse('error', err, type);

            });
      };
      
    }
  ]);
  
  clusterModule.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  });
  
})();




