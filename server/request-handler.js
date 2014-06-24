var fs = require('fs');
var dbPath = __dirname + '/db.json';
/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

module.exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);



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
        var message = '';
        request.on('data', function(data) {
          message += data;
        });
        request.on('end', function(){
          message = JSON.parse(message);

          fs.readFile(dbPath, {'encoding': 'utf8'}, function (err, data) {
            if (err) throw err;
            var parsedData = JSON.parse(data);
            parsedData.results.push(message);

            fs.writeFile(dbPath, JSON.stringify(parsedData), {'encoding': 'utf8'}, function (err) {
              if (err) throw err;
              response.writeHead(201, headers);
              response.end();
            });
          });
        });
        break;
      case 'GET':
        response.writeHead(200, headers);
        fs.readFile(dbPath, {'encoding': 'utf8'}, function (err, data) {
          if (err) throw err;
          response.end(data);
        });
        break;
      case 'OPTIONS':
        response.writeHead(200, headers);
        response.end();
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
    response.writeHead(404, headers);
    response.end();
  }


  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/


};

