// Create web server
// Run: node comments.js

var http = require('http');
var fs = require('fs');
var url = require('url');
var ROOT_DIR = "html/";
var COMMENTS_FILE = ROOT_DIR + "comments.json";

http.createServer(function (req, res) {
    console.log("Request: " + req.method + " to " + req.url);

    if (req.method === "POST") {
        console.log("POST");
        var jsonData = "";
        req.on('data', function (chunk) {
            jsonData += chunk;
        });
        req.on('end', function () {
            var reqObj = JSON.parse(jsonData);
            console.log(reqObj);
            fs.readFile(COMMENTS_FILE, function (err, data) {
                var comments = JSON.parse(data);
                comments.push(reqObj);
                fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function (err) {
                    res.writeHead(200);
                    res.end(JSON.stringify(comments));
                });
            });
        });
    } else if (req.method === "GET") {
        console.log("GET");
        var urlObj = url.parse(req.url, true, false);
        fs.readFile(ROOT_DIR + urlObj.pathname, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    } else {
        res.writeHead(200);
        res.end("Unsupported request method: " + req.method);
    }
}).listen(3000);

console.log("Server running at http://localhost:3000/");