// dependencies

const environment={};

environment.staging={
    port:3000,
    envName:'staging',
    secretKey:'lafjkalfjakfljafl'
};

environment.production={
    port:6000,
    envName:'production',
    secretKey:'tititititit'
} 

// determine which environment was passed

const currentEnvironment=typeof(process.env.NODE_ENV)==='string'?process.env.NODE_ENV:'staging';

// export corresponding evnironment object
const environmentToExport=typeof(environment[currentEnvironment])==='object' ? environment[currentEnvironment] : environment.staging;

// export module
module.exports=environmentToExport;