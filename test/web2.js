const http = require("http")
const url = require("url")

function start() {
    function onRequest(request,response) {
        const pathname =new URL(request.url,"http://${request.headers.host}").pathname
        console.log('Request for ${pathname} received.');

        response.writeHead(200,{"Content-Type":"text/plain"});
        response.write("Hello World!")
        response.end();
    }

    http.createServer(onRequest).listen(8088);
    console.log("Server has started.")
}

module.exports.start=start