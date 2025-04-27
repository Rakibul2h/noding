
const data=require('../../lib/data');
const {hash}=require('../../helper/utilities')

const handler={};

handler.userHandler=(requestProperties,callback)=>{
    
    const acceptedMethods=['get','post','put','delete'];

    if(acceptedMethods.indexOf(requestProperties.method)>-1){

        handler._user[requestProperties.method](requestProperties,callback);
    }else{
        callback(405);
    }
    callback(200,{
        message:'this is a user url',
    });
};


handler._user={};

handler._user.post = (requestProperties,callback)=>{

    const firstName=typeof(requestProperties.body.firstName)==='string' &&requestProperties.body.trim().length>0?requestProperties.body.firstName :false;


    const lastName=typeof(requestProperties.body.lastName)==='string' &&requestProperties.body.trim().length>0?requestProperties.body.lastName :false;

    const phone=typeof(requestProperties.body.phone)==='string' &&requestProperties.body.trim().length===11?requestProperties.body.phone :false;


    const password=typeof(requestProperties.body.password)==='string' &&requestProperties.body.trim().length>0?requestProperties.body.password :false;

    const tosAgreement=typeof(requestProperties.body.tosAgreement)==='boolean' &&requestProperties.body.trim().length>0?requestProperties.body.tosAgreement :false;

    if(firstName && lastName && phone && password && tosAgreement){
        // make sure that the user doesn't already exits
        data.read('users',phone,(err, user)=>{
            if(err){

                let userObject={
                    firstName,
                    lastName,
                    phone,
                    password:hash(password),
                    tosAgreement,
                };

                // store the user to db

                data.create('users',phone,userObject,(err)=>{
                    if(!err){
                        callback(200,{'message':'User was created successfully'});
                    }else{
                        callback(500,{'error':'could not create user!'})
                    }
                })
            }else{
                callback(500,{'error':'There was a problem in server side!'})
            }
        })

    }else{
        callback(400,{
            error:'you have a problem in your request',
        })
    }
}

handler._user.get = (requestProperties,callback)=>{
    
}
handler._user.put = (requestProperties,callback)=>{
    
}
handler._user.delete = (requestProperties,callback)=>{
    
}
module.exports=handler;