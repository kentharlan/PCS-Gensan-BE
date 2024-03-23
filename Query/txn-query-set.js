const txn_query_set = {
    getRoomByRoomNo: "SELECT * FROM rooms WHERE room_no = $1",
    getRateByRateId: "SELECT * FROM rates WHERE rate_id = $1",
    getUserById: "SELECT * FROM users WHERE id = $1",
    insertTransaction: "INSERT INTO transactions (room_no, bill, duration, base_time, additional_time, rate_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    updateRoom: "UPDATE rooms SET status = $1, transaction_no = $2 WHERE room_no = $3",
    timedOutRoom: "UPDATE rooms SET status = $1 WHERE room_no = $2",
    checkOut: "UPDATE transactions SET dt_check_out = NOW() WHERE transaction_no = $1",
    timeOut: "UPDATE transactions SET dt_check_out = NOW() WHERE transaction_no = $1",
    getTxnByTxnNo: "SELECT * FROM transactions WHERE transaction_no = $1;",
    updateTransaction: "UPDATE transactions SET duration = duration + $1, additional_time = additional_time + $1, bill = $2 WHERE transaction_no = $3 RETURNING *;",
    deleteTransaction: "DELETE FROM transactions WHERE transaction_no = $1;",
    getActiveTxns: "SELECT * FROM transactions WHERE transaction_no IN (SELECT transaction_no FROM rooms WHERE status = 2)  ORDER BY room_no",
    updateTransactionRoom: "UPDATE transactions SET room_no = $1 WHERE transaction_no = $2;",
    getHistory: `
        SELECT 
            transaction_no, room_no, dt_check_in, dt_check_out, duration, bill, remarks 
        FROM
            transactions 
        WHERE
            (NULLIF($1, '') IS NULL OR transaction_no ILIKE '%' || $1::text || '%') AND
            (NULLIF($2, '') IS NULL OR dt_check_in >= $2::date) AND
            (NULLIF($3, '') IS NULL OR dt_check_in <= ($3::date + INTERVAL '1 day'))
        ORDER BY 
            transaction_no DESC;
    `,
    cancelTxn: "UPDATE transactions SET dt_check_out = now(), bill = null, remarks = $1 WHERE transaction_no = $2;",
    insertPayment: "INSERT INTO payments (transaction_no, session_id, amount) VALUES ($1, $2, $3) RETURNING *;",
    getPaymentsByTxnNo: "SELECT * FROM payments WHERE transaction_no = $1",
    getActiveSession: "SELECT * FROM sessions WHERE logout_dt IS NULL AND user_id = $1;",
    getPayments: `
        SELECT 
            p.*, s.*
        FROM
            payments p
        LEFT JOIN
            sessions s ON p.session_id = s.session_id
        WHERE
            (NULLIF($1, '') IS NULL OR s.user_id = $1::integer) AND
            (NULLIF($2, '') IS NULL OR s.login_dt >= $2::date) AND
            (NULLIF($3, '') IS NULL OR s.login_dt <= ($3::date + INTERVAL '1 day'))
        ORDER BY 
            p.dt_created DESC;
    `,
    deletePaymentByTxnNo: "DELETE FROM payments WHERE transaction_no = $1;"
}

module.exports = {
    txn_query_set
}