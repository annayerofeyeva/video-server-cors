// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Source Code   - github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC/RecordRTC-to-Nodejs

var server = require('./server'),
    handlers = require('./handlers'),
    router = require('./router'),
    handle = { };

handle["/google2f8123364389b536.html"] = handlers.home;
handle["/home"] = handlers.home;
handle["/upload"] = handlers.upload;
handle._static = handlers.serveStatic;
// handle["/google2f8123364389b536.html"] = handlers.google2f8123364389b536;

server.start(router.route, handle);
