
var confirmationModal = angular.module('myApp.confirmationModal', ['ngRoute', 'ui.bootstrap']);

confirmationModal.controller('ConfirmationModalCtrl', function ($scope, $uibModalInstance, $sce, title, text) {

    $scope.confirmationModalTitle = title;
    $scope.confirmationModalText = $sce.trustAsHtml(text.replace(/\r\n|\r|\n/g, " <br /> "));

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});