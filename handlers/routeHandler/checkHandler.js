const data = require("../../lib/data");
const { hash } = require("../../helper/utilities");
const { parseJSON,createRandomString } = require("../../helper/utilities");
const tokenHandler = require("./tokenHandler");
const {maxChecks}=require('../../helper/environments');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
  
    // validate inputs
    let protocol=typeof(requestProperties.body.protocol)==='string'&& ['http','https'].indexOf(requestProperties.body.protocol)>-1?requestProperties.body.protocol : false;
    
    let url=typeof(requestProperties.body.url)==='string' && requestProperties.body.url.trim().length>0?requestProperties.body.url:false;

    let method=typeof(requestProperties.body.method)==='string'&& ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1?requestProperties.body.method : false;

    let successCodes=typeof(requestProperties.body.successCodes)==='object'&& requestProperties.body.successCodes instanceof Array?requestProperties.body.successCodes : false;

    let timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)==='number'&& requestProperties.body.timeoutSeconds %1 ===0 && requestProperties.body.timeoutSeconds>=1 && requestProperties.body.timeoutSeconds<=5?requestProperties.body.timeoutSeconds : false;

    if(protocol && url && method && successCodes && timeoutSeconds){

        let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

        // lookup the user Phone by reaing the token

        data.read('tokens',token,(err,tokenData)=>{
            if(!err && tokenData){
                let userPhone=parseJSON(tokenData).phone;
                // lookup the user data
                data.read('users',userPhone,(err,userData)=>{
                    if(!err && userData){
                        tokenHandler._token.varify(token,userPhone,(tokenIsValid)=>{
                            if(tokenIsValid)
                            {
                                let userObject=parseJSON(userData);
                                let userCheck=typeof(userObject.checks)==='object' && userObject.checks instanceof Array?userObject.checks:[];

                                // 
                                if(userCheck.length<maxChecks){
                                    let checkId=createRandomString(20);
                                    let checkObject={
                                        'id':checkId,
                                        'userPhone':userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds
                                    };
                                    // svae the object

                                    data.create('checks',checkId,checkObject,(err)=>{
                                        if(!err){
                                            userObject.checks=userCheck;
                                            userObject.checks.push(checkId);

                                            // save the new data
                                            data.update('users',userPhone,userObject,(err)=>{
                                                if(!err){
                                                    callback(200,checkObject);
                                                }else{
                                                    callback(500,{error:'server issue'})
                                                }
                                            })
                                        }else{
                                            callback(500,{error:'There was a problem in the server side!'});
                                        }
                                    })
                                    
                                }else{
                                    callback(401,{error:'Userhas Already reached max check limit!'})
                                }

                            }else{
                                callback(403,{error:'Authentication problem!'})
                            }
                        })
                    }else{  
                        callback(403,{error:'User not found!'});
                    }
                })

            }else{
                callback(403,{error:'authentication problem'})
            }
        })
    }else{
        callback(400,{error:'you have a problem in your request'})
    }
};

handler._check.get = (requestProperties, callback) => {
  
};
handler._check.put = (requestProperties, callback) => {
  
};
handler._check.delete = (requestProperties, callback) => {
  
};
module.exports = handler;
