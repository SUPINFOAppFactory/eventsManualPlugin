'use strict';

(function (angular, window) {
  angular
    .module('eventsManualPluginDesign')
    .controller('DesignHomeCtrl', ['$scope', 'Buildfire', 'LAYOUTS', 'DataStore', 'TAG_NAMES',
      function ($scope, Buildfire, LAYOUTS, DataStore, TAG_NAMES) {
        var DesignHome = this;
        var DesignHomeMaster;
        var _data = {
          design: {
            itemDetailsLayout: "",
            itemDetailsBgImage: ""
          },
          content: {}
        };

        DesignHome.layouts = {
          itemDetailsLayout: [
            {name: "Event_Item_1"},
            {name: "Event_Item_2"},
            {name: "Event_Item_3"},
            {name: "Event_Item_4"}
          ]
        };

        /*On layout click event*/
        DesignHome.changeListLayout = function (layoutName) {
          if (layoutName && DesignHome.data.design) {
            DesignHome.data.design.itemDetailsLayout = layoutName;
            console.log(DesignHome.data);
            saveData(function (err, data) {
                if (err) {
                  return DesignHome.data = angular.copy(DesignHomeMaster);
                }
                else if (data && data.obj) {

                  return DesignHomeMaster = data.obj;

                }
                $scope.$digest();
              }
            )
          }
        };

        /*save method*/
        var saveData = function (callback) {
          callback = callback || function () {

          };
          Buildfire.datastore.save(DesignHome.data, TAG_NAMES.EVENTS_MANUAL_INFO, callback);
        };

        var init = function () {
          /* background image add </end>*/
          Buildfire.datastore.get(TAG_NAMES.EVENTS_MANUAL_INFO, function (err, data) {
            if (err) {
              Console.log('------------Error in Design of People Plugin------------', err);
            }
            else if (data && data.data) {
              DesignHome.data = angular.copy(data.data);
              console.log("init Data:", DesignHome.data);
              if (!DesignHome.data.design)
                DesignHome.data.design = {};
              if (!DesignHome.data.design.itemDetailsLayout)
                DesignHome.data.design.itemDetailsLayout = DesignHome.layouts.itemDetailsLayout[0].name;
              DesignHomeMaster = angular.copy(data.data);
              if (DesignHome.data.design.itemDetailsBgImage) {
                background.loadbackground(DesignHome.data.design.itemDetailsBgImage);
              }
              $scope.$digest();
            }
            else {
              DesignHome.data = _data;
              console.info('------------------unable to load data---------------');
            }
          });
        };

        /* background image add <start>*/
        var background = new Buildfire.components.images.thumbnail("#background");

        background.onChange = function (url) {
          DesignHome.data.design.itemDetailsBgImage = url;
          if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
          }
        };

        background.onDelete = function (url) {
          DesignHome.data.design.itemDetailsBgImage = "";
          if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
          }
        };

        init();

        /*watch the change event and update in database*/
        $scope.$watch(function () {
          return DesignHome.data;
        }, function (oldObj,newObj) {

          if (oldObj != newObj && newObj) {
          console.log("Updated Object:", newObj);
          Buildfire.datastore.save(DesignHome.data, TAG_NAMES.EVENTS_MANUAL_INFO, function (err, data) {
            if (err) {
              return DesignHome.data = angular.copy(DesignHomeMaster);
            }
            else if (data && data.obj) {
              return DesignHomeMaster = data.obj;

            }
            $scope.$digest();
          });
        }
        }, true);

      }]);
})(window.angular);
