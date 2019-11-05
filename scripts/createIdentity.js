const { Credentials } = require('uport-credentials');
const fs = require('fs') 

const identityUser = Credentials.createIdentity();

//print just in case
console.log({identityUser});

// Write data in 'identityOutput*.txt' . 
fs.writeFile('identityOutput' + identityUser.did + '.txt', data, (err) => { 
      
    // In case of a error throw err. 
    if (err) throw err; 
})