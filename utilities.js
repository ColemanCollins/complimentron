exports.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.randomFromArray = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}