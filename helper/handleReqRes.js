// dependencies
const url=require('url');
const {StringDecoder}=require('string_decoder');
const routes=require('../route');
const {notFoundHandler}=require('..//handlers/routeHandler/notFoundHandler');

// module scaffolding
const handler={};
handler.handleReqRes=(req, res)=>{

    const paresedUrl=url.parse(req.url, true);
    const path=paresedUrl.pathname;
    const trimmedPath=path.replace(/^\/+|\/+$/g,'');
    const method=req.method.toLowerCase();
    const queryStringObject=paresedUrl.query;
    const headersObject=req.headers;

    const requestProperties={
        paresedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    }

    const decoder=new StringDecoder('utf-8');
    let realData='';

    const chosenHandler=routes[trimmedPath]?routes[trimmedPath]:notFoundHandler;

    req.on('data',(buffer)=>{
        realData+=decoder.write(buffer);
    });
    req.on('end',()=>{
        realData+=decoder.end();
        console.log(realData);
        
    chosenHandler(requestProperties,(statusCode,payload)=>{
        statusCode=typeof statusCode ==='number'?statusCode:404;
        payload=typeof payload==='object'?payload:{};
        const payloadString=JSON.stringify(payload);
        res.writeHead(statusCode);
        res.end(payloadString);
    })

    })
}

module.exports=handler;