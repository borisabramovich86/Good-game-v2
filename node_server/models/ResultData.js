module.exports = function () {
	return {
			AwayTeam : {
				name : "",
				score : ""
			},
			HomeTeam : {
				name : "",
				score : ""
			},
			Overtime: "",
			WasItAGoodGame : false,
			equals : function(otherResult){

				return  this.Overtime === otherResult.Overtime &&
						this.WasItAGoodGame === otherResult.WasItAGoodGame &&
						this.HomeTeam.name === otherResult.HomeTeam.name &&
						this.HomeTeam.score === otherResult.HomeTeam.score &&
						this.AwayTeam.name === otherResult.AwayTeam.name &&
						this.AwayTeam.score === otherResult.AwayTeam.score;
			}
	};
};

