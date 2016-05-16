var complimentList = require('./compliments');

var generateWeightedComplimentList = function() {
  for (var compliment in complimentList) {
    if (complimentList.hasOwnProperty(compliment)) {
      //for each weight, push that many instances of the string into the weighted list
      for (var i = 0; i < complimentList[compliment]; i++) {weightedComplimentList.push(compliment);}
    };
  };
}

var weightedComplimentList = [];
generateWeightedComplimentList();

var createCompliment = function(template) {
  var sentence = template;
  var occurrences = template.match(/\{\{(.+?)\}\}/g);
  if (occurrences) {
     for (var i = occurrences.length - 1 ; i >= 0; i--) {
      var result = randomFromArray( occurrences[i].replace(/[\{\}]/g, '').trim().split(',') ).trim();
      sentence = sentence.replace(occurrences[i], result);
     }
  }
   return sentence;
};

var randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var print = setInterval(function () {
  console.log(createCompliment(randomFromArray(weightedComplimentList)));
}, 500);