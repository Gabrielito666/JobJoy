const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
module.exports = {
    encryptpass : async (pass)=>{return await bcryptjs.hash(pass, 10);},
    comparePass : (pass, dbPass)=>{if (pass !== undefined){return bcryptjs.compareSync (pass, dbPass)}else{return false};},
    randomString : ()=>{return crypto.randomBytes(64).toString('hex');}
}