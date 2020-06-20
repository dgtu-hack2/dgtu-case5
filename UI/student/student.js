'use strict';

var student = angular.module('myApp.student', ['ngRoute']);

student.controller('StudentCtrl', function ($scope, $q) {

    var student = JSON.parse(localStorage.getItem('student'));
    $scope.student = student;
    console.log(student);
});