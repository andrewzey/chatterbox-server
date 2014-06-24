var url = require('url');
var messages = require('./messages');


module.exports.handler = function(request, response) {

  var requestRouter = {
    'GET': messages.getMessages,
    'POST': messages.postMessage,
    'OPTIONS': messages.sendOptionsResponse
  };

  console.log("Serving request type " + request.method + " for url " + request.url);

  var path = url.parse(request.url).pathname;

  if (path === '/classes/messages' && requestRouter[request.method]) {
    requestRouter[request.method](request, response);
  } else {
    messages.send404(request, response);
  }




  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/


};

