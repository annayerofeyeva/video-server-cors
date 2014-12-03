// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Source Code   - github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC/RecordRTC-to-Nodejs

var config = require('./config'),
    http = require('http'),
    url = require('url');

var port = process.env.PORT || 8000



function start(route, handle) {

    function onRequest(request, response) {

          // response.header('Access-Control-Allow-Origin', '*');
          // response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          // response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
          // response.writeHead(
          //   "200",
          //   "OK",
          //   {
          //       'Access-Control-Allow-Origin': '*',
          //       'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
          //       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          //       "content-type": "text/plain"
          //   }
          //   );
    // var origin = (request.headers.origin || "*");
    // var requestBodyBuffer = [];
    // var requestBody = requestBodyBuffer.join( "" );
    // var responseBody = (
    //     "Thank You For The Cross-Domain AJAX Request:\n\n" +
    //     "Method: " + request.method + "\n\n" +
    //     requestBody
    // );
    // response.writeHead(
    //     "200",
    //     "OK",
    //     {
    //         "access-control-allow-origin": origin,
    //         'Access-Control-Allow-Methods': 'POST',
    //         "content-type": "text/plain",
    //         "content-length": responseBody.length
    //     }
    // );

               
    //             console.log(response)

















        var pathname = url.parse(request.url).pathname,
            postData = '';



        request.setEncoding('utf8');

        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;
        });

        // response.end()
        request.addListener('end', function() {

            var origin = (request.headers.origin || "*");
            var requestBodyBuffer = [];
            var requestBody = requestBodyBuffer.join( "" );
            var responseBody = (
                "Thank You For The Cross-Domain AJAX Request:\n\n" +
                "Method: " + request.method + "\n\n" +
                requestBody
            );

            response.writeHead(
                "200",
                "OK",
                {
                    "access-control-allow-origin": origin,
                    'Access-Control-Allow-Methods': 'POST',
                    "content-type": "text/plain",
                    "content-length": responseBody.length
                }
            );

            
            route(handle, pathname, response, postData);
        });

        
    }

    http.createServer(onRequest).listen(port);
}

exports.start = start;
