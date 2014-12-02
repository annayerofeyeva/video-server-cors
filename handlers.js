// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
// Source Code   - github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC/RecordRTC-to-Nodejs

var config = require('./config'),
    fs = require('fs'),
    sys = require('sys'),
    exec = require('child_process').exec,
    AWS = require('aws-sdk'),
    request = require('request')

var sThree = new AWS.S3();

function home(response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.end(fs.readFileSync('./static/index.html'));
}

// this function uploads files

function upload(response, postData) {
    var files = JSON.parse(postData);

    // writing audio file to disk
    // _upload(response, files.audio);

    _upload(response, files.video);


    if (files.uploadOnlyAudio) {
        response.statusCode = 200;
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(files.audio.name);
    }

    // if (!files.uploadOnlyAudio) {
    //     // writing video file to disk
    //     _upload(response, files.video);

    //     merge(response, files);
    // }
}

// this function merges wav/webm files

function merge(response, files) {
    // detect the current operating system
    var isWin = !!process.platform.match( /^win/ );

    if (isWin) {
        ifWin(response, files);
    } else {
        ifMac(response, files);
    }
}

function _upload(response, file) {
    file.contents = file.contents.split(',').pop();
    fileBuffer = new Buffer(file.contents, "base64");

    sThree.putObject(({Bucket: 'stackovertubeTwo', Key: file.name+'webm', Body: fileBuffer}), function(err, data) {
        if (err) {
          console.log("Error uploading data: ", err);
        } else {
          var video = { link: 'https://s3.amazonaws.com/stackovertubeTwo/'+file.name, questionId: file.name.split('_')[1], author: file.author};
          request.post({url: 'https://overtube-backend.herokuapp.com/postreply', form: video}, function(err, res) {
            console.log(res.body);
            console.log(err);
          });
          console.log(file.name.split('_')[1]);
          console.log("Successfully uploaded data to aws");
        }
    });
}

function serveStatic(response, pathname) {

    var extension = pathname.split('.').pop(),
        extensionTypes = {
            'js': 'application/javascript',
            'webm': 'video/webm',
            'mp4': 'video/mp4',
            'wav': 'audio/wav',
            'ogg': 'audio/ogg',
            'gif': 'image/gif'
        };

    response.writeHead(200, {
        'Content-Type': extensionTypes[extension]
    });
    if (hasMediaType(extensionTypes[extension]))
        response.end(fs.readFileSync('.' + pathname));
    else
        response.end(fs.readFileSync('./static' + pathname));
}

function hasMediaType(type) {
    var isHasMediaType = false;
    ['audio/wav', 'audio/ogg', 'video/webm', 'video/mp4'].forEach(function(t) {
      if(t== type) isHasMediaType = true;
    });
    
    return isHasMediaType;
}

function ifWin(response, files) {
    // following command tries to merge wav/webm files using ffmpeg
    var merger = __dirname + '\\merger.bat';
    var audioFile = __dirname + '\\uploads\\' + files.audio.name;
    var videoFile = __dirname + '\\uploads\\' + files.video.name;
    var mergedFile = __dirname + '\\uploads\\' + files.audio.name.split('.')[0] + '-merged.webm';

    // if a "directory" has space in its name; below command will fail
    // e.g. "c:\\dir name\\uploads" will fail.
    // it must be like this: "c:\\dir-name\\uploads"
    var command = merger + ', ' + audioFile + " " + videoFile + " " + mergedFile + '';
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        } else {
            response.statusCode = 200;
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(files.audio.name.split('.')[0] + '-merged.webm');

            fs.unlink(audioFile);
            fs.unlink(videoFile);
        }
    });
}

function ifMac(response, files) {
    // its probably *nix, assume ffmpeg is available
    var audioFile = __dirname + '/uploads/' + files.audio.name;
    var videoFile = __dirname + '/uploads/' + files.video.name;
    var mergedFile = __dirname + '/uploads/' + files.audio.name.split('.')[0] + '-merged.webm';
    
    var util = require('util'),
        exec = require('child_process').exec;

    var command = "ffmpeg -i " + audioFile + " -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile;

    exec(command, function (error, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);

        if (error) {
            console.log('exec error: ' + error);
            response.statusCode = 404;
            response.end();

        } else {
            response.statusCode = 200;
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(files.audio.name.split('.')[0] + '-merged.webm');

            // removing audio/video files
            fs.unlink(audioFile);
            fs.unlink(videoFile);
        }

    });
}

exports.home = home;
exports.upload = upload;
exports.serveStatic = serveStatic;
