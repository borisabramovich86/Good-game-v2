angular.module('score.controllers', [])
    .controller('scoreController', [
        '$scope',
        '$http',
        function (scope,http) {
            console.info('scores Controller');

            http.get('/api/scores').then(function(results){
                scope.todayScores = results.data.today;
                scope.yesterdayScores = results.data.yesterday;
            })
        }]);