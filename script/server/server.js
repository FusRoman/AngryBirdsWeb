var http = require('http');
var fs = require('fs');

const PORT=8000; 

fs.readFile('../../AngryBirds.html', function (err, html) {

    if (err) throw err;

    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);
        response.end();
    }).listen(PORT);
});

var server = http.createServer(function (req, res) {
    res.writeHead(200);
    res.end('Salut tout le monde !');
});
server.listen(8080);