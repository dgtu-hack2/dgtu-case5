'use strict';

var student = angular.module('myApp.student', ['ngRoute']);

student.controller('StudentCtrl', function ($scope, datesService, $q) {
    var student = JSON.parse(localStorage.getItem('student'));
    $scope.student = student || "";
    $scope.modules = (student && student.Modules) || {};

    $scope.convertFromISO = function (dateInISOFormat) {
        return datesService.parseDateToStringRussian(dateInISOFormat);
    };
});