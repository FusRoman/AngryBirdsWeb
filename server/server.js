const static = require('node-static');

const fileServer = new static.Server('./public', { indexFile: "AngryBirds.html" });

const server = require('http').createServer(function (request, response) {

    request.addListener('end', function () {
        fileServer.serve(request, response, function (err, result) {
            if (err) { // There was an error serving the file
                console.error("Error serving " + request.url + " - " + err.message);

                // Respond to the client

                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    }).resume();

});



server.listen(8000);