// dependencies
const http=require('http');
const {handleReqRes}=require('./helper/handleReqRes');
const environment=require('./helper/environments');
const data=require('./lib/data');

const app={};



app.createServer= ()=>{
    const server=http.createServer(app.handleReqRes);
    server.listen(environment.port,()=>{
        console.log(`app is running in port ${environment.port}`);
    })
}
app.handleReqRes=handleReqRes;

app.createServer();

