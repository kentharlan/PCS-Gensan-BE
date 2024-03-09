const rooms_query_set = {
    getRooms: "SELECT * FROM rooms ORDER BY room_no",
    getRoomByNo: "SELECT * FROM rooms WHERE room_no = $1",
    updateRoom: "UPDATE rooms SET status = $1, transaction_no = $2 WHERE room_no = $3 RETURNING *",
    getRoomsByStatus: "SELECT * FROM rooms WHERE status = $1 ORDER BY room_no",
}

module.exports = {
    rooms_query_set
}