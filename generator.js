var Sentencer = require('sentencer');
var utils = require('./utilities');
var express = require('express');
var app = express();
var engine = require('express-dot-engine');
var path = require('path');
var moment = require('moment');
var webshot = require('webshot');

// configure webshot
var webshotOptions =   {
  screenSize: { width: 335*2, height:   440*2}, 
  shotSize: { width: 335*2, height: 440*2 }, 
  userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
  + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
};

// configure the server
app.engine('dot', engine.__express);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'dot');


//sentence generator part of the stuff
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

//'weight': 
//compliment,
var complimentList = {
  '{{ capitalized_exclamation }}, you are {{ positive_adjective }}!':
  10,

  'You are the {{ superlative }} person in {{ location }}.':
  10,

  'DAYUM.':
  1,

  '<3':
  1,

  'There is a person getting through a hard time right now because you\'re a good friend.':
  3
};

var generateWeightedComplimentList = function() {
  for (var compliment in complimentList) {
    if (complimentList.hasOwnProperty(compliment)) {
      //for each weight, push that many instances of the string into the weighted list
      for (var i = 0; i < complimentList[compliment]; i++) {weightedComplimentList.push(compliment);}
    };
  };
}

var createCompliment = function() {
  return Sentencer.make(utils.randomFromArray(weightedComplimentList));
};

//generate the compliment list
var weightedComplimentList = [];
generateWeightedComplimentList();
console.log(weightedComplimentList);
//counter stuff
var padWithZeros = function(num, size) {
    var s = "00000000" + num;
    return s.substr(-8, 8);
};
var complimentCounter = 1;


// make a route to show the compliments
app.get('/', function (req, res) {
  res.render('index', {compliment: createCompliment(), count: padWithZeros(complimentCounter), date: moment().format('L')} );
  complimentCounter++;
});

app.get('/photo/', function (req, res) {
  res.sendFile(__dirname + '/compliment.png');
  webshot('http://localhost:3000', 'compliment.png', webshotOptions, function(err) {
  });
  // need some sort of callback or ready function because right now if you press the button again too soon it throws
  // an error because it hasn't finished getting a screenshot of the next one
});

//serve the css
app.use(express.static('styles'));
app.listen(3000, function() { 
  console.log('complimentron is running');
});
