var Sentencer = require('sentencer');
weightedComplimentList = [];

Sentencer.configure({
  nounList: [],
  adjectiveList: [],
  actions: {
    superlative: function(){
      var superlativeList = ['coolest', 'neatest', 'most fun', 'funnest', 'most excellently rad']
      return randomFromArray(superlativeList);
    },
    location: function(){
     var locationList = ['Chicago', 'Illinois', 'the Midwest', 'the whole fuckin\' world']
     return randomFromArray(locationList);
    }
  }
});

//compliments                                            // weights
var complimentList = {
'You are the {{ superlative }} person in {{ location }}.' : 10,
'DAYUM.'                                                  : 1,
'<3'                                                      : 1,
};

var generateWeightedComplimentList = function() {
  for (var compliment in complimentList) {
    if (complimentList.hasOwnProperty(compliment)) {

      //for each weight, push that many instances of the string into the weighted list
      for (var i = 0; i < complimentList[compliment]; i++) {
        weightedComplimentList.push(compliment);
      }

    };
  };
}

var randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var createCompliment = function() {
  return Sentencer.make(randomFromArray(weightedComplimentList));
};

//generate the compliment list
generateWeightedComplimentList();
//log a compliment into the terminal every second
setInterval( function() {
  console.log(createCompliment());
}, 1000);