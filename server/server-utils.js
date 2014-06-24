/* These headers will allow Cross-Origin Resource Sharing (CORS).
   * This CRUCIAL code allows this server to talk to websites that
   * are on different domains. (Your chat client is running from a url
   * like file://your/chat/client/index.html, which is considered a
   * different domain.) */
module.exports.headers = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10,                                       //Seconds.
    "Content-Type": 'application/json'
  };

module.exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, module.exports.headers);
  response.end(JSON.stringify(data));
};
