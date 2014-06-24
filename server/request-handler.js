/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
module.exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var messages = {results: []};
  var statusCode;


  /* These headers will allow Cross-Origin Resource Sharing (CORS).
   * This CRUCIAL code allows this server to talk to websites that
   * are on different domains. (Your chat client is running from a url
   * like file://your/chat/client/index.html, which is considered a
   * different domain.) */
  var defaultCorsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 //Seconds.
  };

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";

  /* .writeHead() tells our server what HTTP status code to send back */


  if (request.url === '/classes/messages') {
    switch(request.method) {
      case 'POST':
        statusCode = 201;
        response.writeHead(statusCode, headers);
        var message = '';
        request.on('data', function(data) {
          message += data;
        });
        request.on('end', function(){
          message = JSON.parse(message);
          messages.results.push(message);
          response.end(JSON.stringify(messages));
          console.log(JSON.parse(JSON.stringify(messages)).results[0].username);
        });
        break;
      case 'GET':
        statusCode = 200;
        response.writeHead(statusCode, headers);
        response.write(JSON.stringify(messages));
        break;
      // case 'DELETE':
      //   //code block
      //   break;
      // case 'UPDATE':
      //   //code block
      //   break;
      default:
        //default code block
    }
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
  }

  // if (request.url === '/classes/room') {
  //   switch(request.method) {
  //     case 'POST':
  //       statusCode = 201;
  //       response.writeHead(statusCode, headers);
  //       var message = '';
  //       request.on('data', function(data) {
  //         message += data;
  //       });
  //       request.on('end', function() {
  //         message = JSON.parse(message);
  //         messages.results.push(message);
  //         //console.log("messages" + messages);
  //         console.log(JSON.parse(JSON.stringify(messages)).results[0].username);
  //         response.write(JSON.stringify(messages));
  //       });
  //       break;
  //     case 'GET':
  //       statusCode = 200;
  //       response.writeHead(statusCode, headers);
  //       response.write(JSON.stringify(messages));
  //       break;
  //     // case 'DELETE':
  //     //   //code block
  //     //   break;
  //     // case 'UPDATE':
  //     //   //code block
  //     //   break;
  //     default:
  //       //default code block
  //   }
  // } else {
  //   statusCode = 404;
  //   response.writeHead(statusCode, headers);
  // }


  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  response.end();

};

