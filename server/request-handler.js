var utils = require('./server-utils');
var fs = require('fs');
var url = require('url');
var messages = require('./messages');

var serverPath = __dirname.split("/");
serverPath.pop();
var clientPath = serverPath.join("/");


module.exports.handler = function(request, response) {

  var requestRouter = {
    'GET': messages.getMessages,
    'POST': messages.postMessage,
    'OPTIONS': messages.sendOptionsResponse
  };

  console.log("Serving request type " + request.method + " for url " + request.url);

  var path = url.parse(request.url).pathname;
  var subPath = request.url.split('/');

  if (request.url === '/' || request.url[1] === '?') {
    utils.headers['Content-Type'] = "text/html";
    var html = fs.readFileSync(clientPath + '/client/index.html');
    response.writeHead(200, utils.headers);
    response.end(html);
    utils.headers['Content-Type'] = "application/json";
  } else if (path === '/classes/messages' && requestRouter[request.method]) {
    requestRouter[request.method](request, response);
  } else if (subPath[1] === 'client') {

    var filetype = request.url.split('.').pop();
    if (filetype === 'js') {
      filetype = "javascript";
    }
    utils.headers['Content-Type'] = "text/" + filetype;
    var file = fs.readFileSync(clientPath + '/client/' + request.url);
    response.writeHead(200, utils.headers);
    response.end(file);
    utils.headers['Content-Type'] = "application/json";
  } else {
    messages.send404(request, response);
  }




  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/


};

