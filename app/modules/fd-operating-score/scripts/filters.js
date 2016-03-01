angular.module('operatingScore.filters', [])
    .filter(
    'targetingNameFilter',
    [
        'MessageService',
        function (
                  messageService) {

            return function (ts, name) {
                if (name == '')
                    return ts;
                else
                    return ts.findAll({"name": new RegExp(name,"g")});
            };
        }]);