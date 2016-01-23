var Sentencer = require('sentencer');

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

var compliments = [
'You are the {{ superlative }} person in {{ location }}.',
'DAYUM.',
'<3',
];

var randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
} 

var createCompliment = function() {
  return Sentencer.make(randomFromArray(compliments));
};

setInterval( function() {
  console.log(createCompliment());
}, 1000);