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
                games : '=',
                date : '@'
            },
            controller: [
                '$rootScope',
                '$scope',
                function ($rootScope, scope) {
                    console.log('Loaded score!');
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