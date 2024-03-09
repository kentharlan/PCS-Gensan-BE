const { timed_out } = require('../Services/checkout')

class timeouts {
 static timeout = [];

 static async insertTimeout (room, startTime, Duration) {
    const checkin_dt = new Date(startTime);
    const current_dt = new Date();
    const duration = parseInt(Duration) 
    const timeLeft = (checkin_dt.setTime(checkin_dt.getTime() + (duration*60*60*1000))) - current_dt

    if (timeLeft > 0) {
        timeouts.timeout[room] = setTimeout(() => {
            timed_out(room);
        }, timeLeft)
    } else {
        timed_out(room);
    }
 }

 static async cancelTimeout (room) {
    if (timeouts.timeout[room]) {
        clearTimeout(timeouts.timeout[room]);
    }
 };
}

module.exports = {
    timeouts
}