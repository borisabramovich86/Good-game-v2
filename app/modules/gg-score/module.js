angular.module(
    'score',
    [
        'score.controllers',
        'score.directives',
        'score.services',
        'score.filters',
        'ui.router'
    ]).config([
    '$stateProvider',
    '$urlRouterProvider',

    function ($stateProvider,
              $urlRouterProvider) {


        //$urlRouterProvider.otherwise('/operating-score');


        //$stateProvider
        //    .state('operating-score', {
        //        url: '/operating-score',
        //        views: {
        //            'fd-operating-score-container': {
        //                templateUrl: 'fd-operating-score.htm'
        //            }
        //        }
        //    })
    }]);