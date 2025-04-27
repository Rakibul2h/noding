
const data=require('../../lib/data');
const {hash}=require('../../helper/utilities');
const {parseJSON}=require('../../helper/utilities');
const handler={};

handler.userHandler=(requestProperties,callback)=>{
    
    const acceptedMethods=['get','post','put','delete'];

    if(acceptedMethods.indexOf(requestProperties.method)>-1){

        handler._user[requestProperties.method](requestProperties,callback);
    }else{
        callback(405);
    }
    
};


handler._user={};

handler._user.post = (requestProperties,callback)=>{

    const firstName=typeof(requestProperties.body.firstName)==='string' &&requestProperties.body.firstName.trim().length>0?requestProperties.body.firstName :false;


    const lastName=typeof(requestProperties.body.lastName)==='string' &&requestProperties.body.lastName.trim().length>0?requestProperties.body.lastName :false;

    const phone=typeof(requestProperties.body.phone)==='string' &&requestProperties.body.phone.trim().length===11?requestProperties.body.phone :false;


    const password=typeof(requestProperties.body.password)==='string' &&requestProperties.body.password.trim().length>0?requestProperties.body.password :false;

    const tosAgreement=typeof(requestProperties.body.tosAgreement)==='boolean'?requestProperties.body.tosAgreement :false;

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
            'error':'you have a problem in your request',
        })
    }
}

handler._user.get = (requestProperties,callback)=>{
    
    // check the phone number if valid
    const phone=typeof(requestProperties.queryStringObject.phone)==='string' &&requestProperties.queryStringObject.phone.trim().length===11?requestProperties.queryStringObject.phone :false;

    if(phone){
        // Look up the user
        data.read('users',phone,(err,u)=>{
            const user={...parseJSON(u)}

            if(!err && user){
                delete user.password;
                callback(200,user);
            }else{
                callback(404,{'error':'Requested user was not found'})
            }
        })
    }else{
        callback(404,{'error':'Requested user Was not found'})
    }

}
handler._user.put = (requestProperties,callback)=>{

    const phone=typeof(requestProperties.body.phone)==='string' &&requestProperties.body.phone.trim().length===11?requestProperties.body.phone :false;

    const firstName=typeof(requestProperties.body.firstName)==='string' &&requestProperties.body.firstName.trim().length>0?requestProperties.body.firstName :false;


    const lastName=typeof(requestProperties.body.lastName)==='string' &&requestProperties.body.lastName.trim().length>0?requestProperties.body.lastName :false;

    const password=typeof(requestProperties.body.password)==='string' &&requestProperties.body.password.trim().length>0?requestProperties.body.password :false;
    if(phone){
        if(firstName ||lastName||password)
        {
            // lookup the user
            data.read('users',phone,(err,uData)=>{
                const userData={...parseJSON(uData)}
                if(!err && userData)
                {
                    if(firstName)
                    {
                        userData.firstName=firstName
                    }
                    if(lastName)
                    {
                        userData.lastName=lastName
                    }
                    if(password)
                    {
                        userData.password=hash(password);
                    }

                    // store to database
                    data.update('users',phone,userData,(err)=>{
                        if(!err)
                        {
                            callback(200,{'message':'User was updated successfully'})
                        }else{
                            callback(500,{error:'there was a problem in the server side'})
                        }
                    })
                }else{
                    callback(400,{error:'you have a problem in your request'})
                }
            })


        }else{
            callback(400,{'error':'You have a problem in your request',})
        }
    }else{
        callback(400,{'error':'Invalid phone number. Please try again.'})
    }


}
handler._user.delete = (requestProperties,callback)=>{
    const phone=typeof(requestProperties.queryStringObject.phone)==='string' &&requestProperties.queryStringObject.phone.trim().length===11?requestProperties.queryStringObject.phone :false;


    if(phone){

        // lookup the user file
        data.read('users',phone,(err,userData)=>{
            if(!err && userData)
            {
                data.delete('users',phone,(err)=>{
                    if(!err){
                        callback(200,{"message":"User was successfully deleted"})
                    }else{
                        callback(500,{'error':'there is an error'})
                    }
                })
            }else{
                callback(500,{'error':'There was a server side error!'})
            }
        })
    }else{
        callback(400,{error:'There was a problem in your request'})
    }
}
module.exports=handler;