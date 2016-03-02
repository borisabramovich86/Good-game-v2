angular.module('templates', []);

angular.module(
    'mainApp', [
        'mainApp.controllers',
        'mainApp.services',
        'templates',
        'score'
    ])
    .run([
        '$rootScope',
        function ($rootScope) {
        }
    ]);