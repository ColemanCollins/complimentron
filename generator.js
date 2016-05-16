var moment = require('moment')
  , getPixels = require('get-pixels')
  , path = require('path')
  , complimentList = require('./compliments')

  , Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(586, 770)
  , Font = Canvas.Font
  , ctx = canvas.getContext('2d')

  , Gpio = require('onoff').Gpio
  , button = new Gpio(18, 'in', 'both')
  , led = new Gpio(17, 'out')

  , escpos = require('escposify')
  , device = new escpos.USB(0x0485, 0x7541)
  , printer = new escpos.Printer(device)
  , allowedToPrint = true;

device.open();
led.writeSync(1);

function fontFile(name) { return path.join(__dirname, name); };
chicago = new Font('Chicago', fontFile('chicago.ttf'));


var generateWeightedComplimentList = function() {
  for (var compliment in complimentList) {
    if (complimentList.hasOwnProperty(compliment)) {
      //for each weight, push that many instances of the string into the weighted list
      for (var i = 0; i < complimentList[compliment]; i++) {weightedComplimentList.push(compliment);}
    };
  };
}

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

//counter stuff
var padWithZeros = function(num, size) {
    var s = "00000000" + num;
    return s.substr(-8, 8);
};
var complimentCounter = 1;


// for word stuff
var randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var getLines = function(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

//generate the compliment list
var weightedComplimentList = [];
generateWeightedComplimentList();

var printCompliment = function(callback) { //how to do multithreading and/or a callback for blinky

  console.time('canvas');
  ctx.font = '20px Chicago';
  ctx.fillText('Compliment no. ' + padWithZeros(complimentCounter), 12, 44);
  ctx.fillText('This compliment was printed just for you by', 12, 696);
  ctx.fillText('Complimentron v1.01.', 12, 719);
  ctx.fillText('Thank you for being complimented.', 12, 756);
  ctx.fillRect(9,67,567,6);
  ctx.fillRect(9,654,567,2);

  ctx.textAlign = 'right';
  ctx.fillText(moment().format('L'), 586-12, 44);

  ctx.font = '51px Chicago';
  ctx.textAlign = 'left';
  var lines = getLines( ctx, createCompliment(), 565)
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 12, 136+(55*i) );
  };
  console.timeEnd('canvas');

  console.time('convert');
  canvas.toDataURL('image/png', function(err, png){
    getPixels(png, function (err, pixels) {
      if (err) throw err;
      console.timeEnd('convert');
      console.time('printy');

      printer
        .raster(escpos.image(pixels))
        .cut()
        .flush();
        
      ctx.clearRect(0,0,586, 770);
      complimentCounter++;
      callback();
      console.timeEnd('printy');
    });
  });
};


button.watch(function(err, value) {
  if (allowedToPrint) {
    allowedToPrint = false; 

    var blinkLed = setInterval( function() {
      led.writeSync(led.readSync() === 0 ? 1 : 0)
    }, 200);
    // console.time('print');

    printCompliment( function() {
      clearInterval(blinkLed);  
      led.writeSync(1);
    });

    // console.timeEnd('print');
    setTimeout(function() {
      allowedToPrint = true; 
    },1000);
  }
});

//-------------------------------------//

function exit() {
  led.writeSync(0);
  process.exit();
}
 
process.on('SIGINT', exit);