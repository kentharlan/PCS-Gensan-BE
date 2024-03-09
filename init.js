const { rooms_query_set: rqs } = require('./Query/rooms-query-set')
const { txn_query_set: tqs } = require('./Query/txn-query-set')
const { Pg } = require('./Pg/Pg')
const { timeouts } = require("./timeouts/timeouts")
const { updateAllRoomPower } = require('./Services/power')

const init = async () => {
    const occupiedRooms = await Pg.query(rqs.getRoomsByStatus, [2]);

    for (const room of occupiedRooms) {
        const res = await Pg.query(tqs.getTxnByTxnNo, [room.transaction_no]);
        const txn = res[0];

        timeouts.insertTimeout(room.room_no, txn.dt_check_in, txn.duration);
    }

    await updateAllRoomPower();
}

module.exports = {
    init
}