const txn_query_set = {
    getRoomByRoomNo: "SELECT * FROM rooms WHERE room_no = $1",
    getRateByRateId: "SELECT * FROM rates WHERE rate_id = $1",
    getUserById: "SELECT * FROM users WHERE id = $1",
    insertTransaction: "INSERT INTO transactions (room_no, bill, duration, base_time, additional_time, rate_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    updateRoom: "UPDATE rooms SET status = $1, transaction_no = $2 WHERE room_no = $3",
    timedOutRoom: "UPDATE rooms SET status = $1 WHERE room_no = $2",
    checkOut: "UPDATE transactions SET cashier = $1, dt_check_out = NOW() WHERE transaction_no = $2",
    timeOut: "UPDATE transactions SET dt_check_out = NOW() WHERE transaction_no = $1",
    getTxnByTxnNo: "SELECT * FROM transactions WHERE transaction_no = $1;",
    updateTransaction: "UPDATE transactions SET duration = duration + $1, additional_time = additional_time + $1, bill = $2 WHERE transaction_no = $3 RETURNING *;",
    deleteTransaction: "DELETE FROM transactions WHERE transaction_no = $1;",
    getActiveTxns: "SELECT * FROM transactions WHERE transaction_no IN (SELECT transaction_no FROM rooms WHERE status = 2)  ORDER BY room_no",
    updateTransactionRoom: "UPDATE transactions SET room_no = $1 WHERE transaction_no = $2;",
    getHistory: "select transaction_no, room_no, dt_check_in, dt_check_out, duration, bill, cashier, remarks from transactions order by transaction_no desc;",
    cancelTxn: "UPDATE transactions SET dt_check_out = now(), bill = null, duration = null, base_time = null, additional_time = null, remarks = 'Cancelled', cashier = $1 WHERE transaction_no = $2;"
}

module.exports = {
    txn_query_set
}