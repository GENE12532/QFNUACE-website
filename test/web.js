const http =require("http");

const server =http.createServer((req,res)=>{
    const {url,method}=req;

    if(url==="/" && method === "GET"){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.end("Home Page");
    }
    else if(url==="/about" && method ==="GET"){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.end("About Page");
    }
    else{
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.end("404 not Found");
    }
})

server.listen(3000,()=>{
    console.log("server is running")
})