var utils = require('./server-utils');
var fs = require('fs');
var dbPath = __dirname + '/db.json';

module.exports.getMessages = function(request, response){
  fs.readFile(dbPath, {'encoding': 'utf8'}, function (err, data) {
    if (err) throw err;
    utils.sendResponse(response, JSON.parse(data), 200);
  });
};
module.exports.postMessage = function(request, response){
  var message = '';
  request.on('data', function(data) {
    message += data;
  });
  request.on('end', function(){
    message = JSON.parse(message);

    fs.readFile(dbPath, {'encoding': 'utf8'}, function (err, data) {
      if (err) throw err;
      var parsedData = JSON.parse(data);
      parsedData.results.unshift(message);

      fs.writeFile(dbPath, JSON.stringify(parsedData), {'encoding': 'utf8'}, function (err) {
        if (err) throw err;
        utils.sendResponse(response, parsedData, 201);
      });
    });
  });
};
module.exports.sendOptionsResponse = function(request, response){
  utils.sendResponse(response, null, 200);
};


module.exports.send404 = function(request, response){
  utils.sendResponse(response, null, 404);
};
