// dependencies
const http=require('http');
const {handleReqRes}=require('./helper/handleReqRes');
const environment=require('./helper/environments');
const data=require('./lib/data');
// app object
const app={};

//test case
// data.create('test','newFile',{name:'bangladesh',lang:'bangla'},(err)=>{
//     console.log(`error was`,err);
// })

// data.read('test','newFile',(err,data)=>{
//     console.log(err,data);
// })
// app.config={
    // data.update('test','newFile',{'name':'Rakibul','nationality':'Bangladeshi'},(err)=>{
    //     console.log(err);
    // })

    data.delete('test','newFile',(err)=>{
        console.log(err);
    })
//     port:4000,
// }

// main code

app.createServer= ()=>{
    const server=http.createServer(app.handleReqRes);
    server.listen(environment.port,()=>{
        console.log(`app is running in port ${environment.port}`);
    })
}
app.handleReqRes=handleReqRes;

app.createServer();

