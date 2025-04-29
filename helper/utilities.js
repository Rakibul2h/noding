
const crypto=require('crypto');
const  environments=require('./environments');
const utilities={};

// parse JSON sting to object

utilities.parseJSON=(jsonString)=>{
    let output ={};

    try{
        output = JSON.parse(jsonString);
    }catch{
        output={};
    }
    return output;
}

// hash string;
utilities.hash=(str)=>{
    if(typeof(str)==='string' && str.length>0){
        let hash=crypto.createHmac('sha256',environments.secretKey).update(str).digest('hex');

        return hash;

    }else{
        return false;
    }
}
utilities.createRandomString=(strlength)=>{
    let length=strlength;
    length=typeof(strlength)==='number' && strlength>0?strlength:false;

    if(length){
        let possibleCharacters='abcdefgfijklmnopqrstuvwxyz1234567890';

        let output='';
        for(let i=1;i<=length;i++){
            let randomCharacter=possibleCharacters.charAt(Math.floor(Math.random()*(possibleCharacters.length)));
            output+=randomCharacter
            }
            return output;

    }else{
        return false;
    }
}

module.exports=utilities