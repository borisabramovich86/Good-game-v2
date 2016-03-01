angular.module('templates', []);

angular.module(
    'mainApp', [
        'mainApp.controllers',
        'mainApp.services',
        'templates'
    ])
    .run([
        '$rootScope',
        function ($rootScope) {
        }
    ]);