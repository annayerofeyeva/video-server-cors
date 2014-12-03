// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Source Code   - github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC/RecordRTC-to-Nodejs

var config = require('./config'),
    http = require('http'),
    url = require('url');

var port = process.env.PORT || 8000



function start(route, handle) {

    function onRequest(request, response) {

          response.header('Access-Control-Allow-Origin', '*');
          response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')


        var pathname = url.parse(request.url).pathname,
            postData = '';



        request.setEncoding('utf8');

        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;
        });

        request.addListener('end', function() {
            route(handle, pathname, response, postData);
        });
    }

    http.createServer(onRequest).listen(port);
}

exports.start = start;
