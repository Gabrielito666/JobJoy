const moment = require('moment-timezone');
module.exports = ()=>{
    const now = moment().tz('Chile/Continental');
    const midnight = now.clone().add(1, 'day').startOf('day');
    const msUntilMidnight = midnight.diff(now);
    return msUntilMidnight;
}