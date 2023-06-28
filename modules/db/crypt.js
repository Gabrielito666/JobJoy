const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
module.exports = {
    encryptpass : async (pass)=>{return await bcryptjs.hash(pass, 10);},
    comparePass : (pass, dbPass)=>{return bcryptjs.compareSync (pass, dbPass);},
    randomString : ()=>{return crypto.randomBytes(64).toString('hex');}
}