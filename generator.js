var Sentencer = require('sentencer');
var utils = require('./utilities');
var weightedComplimentList = [];

Sentencer.configure({
  nounList: [],
  adjectiveList: [],
  actions: {
    capitalized_exclamation: function(){
      var exclamationList = ['wow'];
      var exclamation = utils.randomFromArray(exclamationList);
      return utils.capitalizeFirstLetter(exclamation);
    },
    exclamation: function(){
      var exclamationList = ['wow'];
      return utils.randomFromArray(exclamationList);
    },
    location: function(){
     var locationList = ['Chicago', 'Illinois', 'the Midwest', 'the whole fuckin\' world'];
     return utils.randomFromArray(locationList);
    },
    positive_adjective: function() {
     var positiveAdjectiveList = ['amazing','delightful','a breath of fresh air','something special'];
     return utils.randomFromArray(positiveAdjectiveList);
    },
    superlative: function(){
      var superlativeList = ['coolest','neatest','most fun','most excellently rad'];
      return utils.randomFromArray(superlativeList);
    }
  }
});

    //compliments                                            // weights
var complimentList = {
  '{{ capitalized_exclamation }}, you are {{ positive_adjective }}!' : 10,
  'You are the {{ superlative }} person in {{ location }}.'          : 10,
  'DAYUM.'                                                           : 1,
  '<3'                                                               : 1,
};

var generateWeightedComplimentList = function() {
  for (var compliment in complimentList) {
    if (complimentList.hasOwnProperty(compliment)) {

      //for each weight, push that many instances of the string into the weighted list
      for (var i = 0; i < complimentList[compliment]; i++) {weightedComplimentList.push(compliment);
      }

    };
  };
}

var createCompliment = function() {
  return Sentencer.make(utils.randomFromArray(weightedComplimentList));
};

//generate the compliment list
generateWeightedComplimentList();
//log a compliment into the terminal every second
setInterval( function() {
  console.log(createCompliment());
}, 1000);