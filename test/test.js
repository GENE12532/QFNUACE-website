const http = require("http");

http.createServer((request,response) => {
    
    response.writeHead(200,{"content-Type":"text/plain"});

    response.end("Hello World\n");
}).listen(8088);

console.log("Server running 127.0.0.1:8888");