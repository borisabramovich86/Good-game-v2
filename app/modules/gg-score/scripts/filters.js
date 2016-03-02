angular.module('score.filters', [])
    .filter(
    'teamNameFilter',
    [function () {

            return function (team) {

                switch(team.toLowerCase()){
                    case("orlando"):
                        return "ORL";
                    case("philadelphia"):
                        return "PHL";
                    case("chicago"):
                        return "CHI";
                    case("miami"):
                        return "MIA";
                    case("phoenix"):
                        return "PHX";
                    case("new york"):
                        return "NY";
                    case("portland"):
                        return "POR";
                    case("boston"):
                        return "BOS";
                    case("toronto"):
                        return "TOR";
                    case("dallas"):
                        return "DAL";
                    case("atlanta"):
                        return "ATL";
                    case("washington"):
                        return "ATL";
                    case("la lakers"):
                        return "LAL";
                    case("golden state"):
                        return "GSW";
                    case("san antonio"):
                        return "SA";
                    case("milwaukee"):
                        return "MIL";
                    case("minnesota"):
                        return "MIN";
                    case("denver"):
                        return "DEN";
                    case("brooklyn"):
                        return "BRK";
                    case("la clippers"):
                        return "LAC";
                    case("oklahoma city"):
                        return "OKC";
                    case("new orleans"):
                        return "NO";
                    case("charlotte"):
                        return "CHA";
                    case("houston"):
                        return "HOU";
                    case("indiana"):
                        return "IND";
                    case("detroit"):
                        return "DET";
                    case("sacramento"):
                        return "SAC";
                    case("utah"):
                        return "UTA";
                    case("memphis"):
                        return "MEM";
                    default:
                        return team;
                }
            };
        }]);