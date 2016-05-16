var Sentencer = require('sentencer');
var exec = require('child_process').exec;
var express = require('express');
var app = express();
var engine = require('express-dot-engine');
var path = require('path');
var moment = require('moment');
var webshot = require('webshot');
var Jimp = require('jimp');
var getPixels = require('get-pixels');
var escpos = require('escposify');
var device = new escpos.USB(0x0485, 0x7541);
var printer = new escpos.Printer(device);
var Gpio = require('onoff').Gpio;
var button = new Gpio(18, 'in', 'both');
var led = new Gpio(17, 'out');
device.open();

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

// functions for word stuff
var capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}


//sentence generator part of the stuff
Sentencer.configure({
  nounList: [],
  adjectiveList: [],
  actions: {
    capitalized_exclamation: function(){
      var exclamationList = ['wow'];
      var exclamation = randomFromArray(exclamationList);
      return capitalizeFirstLetter(exclamation);
    },
    exclamation: function(){
      var exclamationList = ['wow'];
      return randomFromArray(exclamationList);
    },
    location: function(){
     var locationList = ['Chicago', 'Illinois', 'the Midwest', 'the whole fuckin\' world'];
     return randomFromArray(locationList);
    },
    positive_adjective: function() {
     var positiveAdjectiveList = ['amazing','delightful','a breath of fresh air','something special'];
     return randomFromArray(positiveAdjectiveList);
    },
    superlative: function(){
      var superlativeList = ['coolest','neatest','most fun','most excellently rad'];
      return randomFromArray(superlativeList);
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
  return Sentencer.make(randomFromArray(weightedComplimentList));
};

//generate the compliment list
var weightedComplimentList = [];
generateWeightedComplimentList();

//counter stuff
var padWithZeros = function(num, size) {
    var s = "00000000" + num;
    return s.substr(-8, 8);
};
var complimentCounter = 1;


// a route to show the compliments to webshot
app.get('/', function (req, res) {
  res.render('index', {compliment: createCompliment(), count: padWithZeros(complimentCounter), date: moment().format('L')} );
  complimentCounter++;
});

//serve the route
app.use(express.static('styles'));
app.listen(3000, function() { 
  console.log('complimentron is running');
});

var printCompliment = function() {

  var blinkLed = setInterval( function() {
    led.writeSync(led.readSync() === 0 ? 1 : 0)
  }, 200);

  //this timer to be replaced with a physical button trigger
    webshot('http://localhost:3000', 'compliment.png', webshotOptions, function(err) {

      Jimp.read('compliment.png', function (err, image) {

        image.brightness(0.4).contrast(1).resize(335*1.75,440*1.75)
        .write('compliment.png', function(){

          getPixels('compliment.png', function (err, pixels) {
            if (err) throw err;
            printer
              .raster(escpos.image(pixels))
              .cut()
              .flush();
              
              clearInterval(blinkLed);             
              led.writeSync(1);
          });
        });
      });
    });
};

var allowedToPrint = true;
button.watch(function(err, value) {
  if (allowedToPrint) {
    console.log('printing??');
    printCompliment();
    allowedToPrint = false; 
    setTimeout( function() { allowedToPrint = true; }, 5000);
  }
});



function exit() {
  led.writeSync(0);
  process.exit();
}
 
process.on('SIGINT', exit);
