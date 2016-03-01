angular.module(
    'operatingScore',
    [
        'operatingScore.controllers',
        'operatingScore.directives',
        'operatingScore.services',
        'operatingScore.filters',
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