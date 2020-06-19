
var info = angular.module('myApp.infoModal', ['ngRoute', 'ui.bootstrap']);

info.controller('InfoModalWindowCtrl', function ($scope, $uibModalInstance, $timeout, element, title, $sce) {
    $scope.element = $sce.trustAsHtml(element);
    $scope.title = title;
    $scope.close = function () {
        $uibModalInstance.close();
    };
});