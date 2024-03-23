const { Pg } = require('../Pg/Pg')
const { txn_query_set: qs } = require('../Query/txn-query-set');
const { updateRoomPower } = require('./power');

const check_out = async (room_no) => {
    const getRoom = await Pg.query(qs.getRoomByRoomNo, [room_no]);
    const room = getRoom[0];

    // set checkout time
    await Pg.query(qs.checkOut, [room.transaction_no])

    // update room status
    await Pg.query(qs.updateRoom, [3, null, room_no])

    // turn off room power
    await updateRoomPower(room_no, 3);
}

const timed_out = async (room_no) => {
    const getRoom = await Pg.query(qs.getRoomByRoomNo, [room_no]);
    const room = getRoom[0];

    // set timeout time
    await Pg.query(qs.timeOut, [room.transaction_no])

    // update room status
    await Pg.query(qs.timedOutRoom, [4, room_no])

    // turn off room power
    await updateRoomPower(room_no, 4);
}

module.exports = {
    check_out,
    timed_out
}