'use strict';

var grade = angular.module('myApp.grade', ['ngRoute']);

grade.controller('GradeCtrl', function ($scope, userService, programService, $location, $q) {
    listStudents();
    var programs = getPrograms();

    function listStudents() {
        userService.getStudents().then(function (response) {
            var data = response;

            if (data[0].Students) {
                $scope.students = data[0].Students;
            }
        });
    };

    $scope.lookStudent = function (student) {
        localStorage.setItem('student', JSON.stringify(student));
        $location.path('student');
    };

    function getPrograms() {
        programService.getPrograms().then(function (response) {
            var data = response;

            if (data[0].Progs) {
                programs = data[0].Progs;
                var programsTmp = [];
                angular.forEach(programs, function (program) {
                    programsTmp.push(program)
                })
                programs = programsTmp;
            }
        });
    }

    $scope.getProgramName = function(programId) {
        var progName = programId;
         angular.forEach(programs, function(program) {
             if (program.Code === programId) {
                 progName = program.ProgName;
             }
        });

        return progName;
    };
});