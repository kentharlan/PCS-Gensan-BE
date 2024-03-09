const { Pg } = require('../Pg/Pg')
const { rooms_query_set: qs } = require('../Query/rooms-query-set');

const getRooms = async () => {
    let response = {
        result: null,
        error: null
    }
    try {
        const rooms = await Pg.query(qs.getRooms, []);
        response.result = rooms;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const getRoomByNo = async ({room_no}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const rooms = await Pg.query(qs.getRoomByNo, [room_no]);
        const res = rooms[0]
        response.result = res;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const updateRoom = async ({data, room_no}) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const {
            status,
            transaction_no
        } = data

        const rooms = await Pg.query(qs.updateRoom, [
            status,
            transaction_no,
            room_no
        ]);
        
        const res = rooms[0]
        response.result = res;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const getRoomByStatus = async ({ status }) => {
    let response = {
        result: null,
        error: null
    }
    try {
        const vacant = await Pg.query(qs.getRoomsByStatus, [status]);
        response.result = vacant;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

module.exports = {
    getRooms,
    getRoomByNo,
    updateRoom,
    getRoomByStatus
}