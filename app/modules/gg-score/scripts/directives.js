angular.module('score.directives', [])
    .directive('ggScore', [
    '$templateCache',
    '$state',
    function ($templateCache,
              $state) {
        return {
            restrict: 'EA',
            template: $templateCache.get('gg-score.htm'),
            replace: true,
            scope: {
                score : '='
            },
            controller: [
                '$rootScope',
                '$scope',
                function ($rootScope, scope) {
                    console.log('Loaded score!');

                    scope.homeTeam = scope.score.HomeTeam.name;
                    scope.awayTeam = scope.score.AwayTeam.name;
                    scope.goodGame = scope.score.WasItAGoodGame;
                    scope.result = scope.score.Score;
                }]
        }
    }])
    .directive('ggMainScore', [
        '$templateCache',
        '$state',
        function ($templateCache,
                  $state) {
            return {
                restrict: 'EA',
                template: $templateCache.get('gg-scores-container.htm'),
                replace: true
            }
        }]);