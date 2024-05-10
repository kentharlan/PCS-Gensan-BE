const txn_query_set = {
    getRoomByRoomNo: "SELECT * FROM rooms WHERE room_no = $1",
    getRateByRateId: "SELECT * FROM rates WHERE rate_id = $1",
    getUserById: "SELECT * FROM users WHERE id = $1",
    insertTransaction: `
        INSERT INTO
            transactions (
                room_no,
                bill,
                duration,
                base_time,
                additional_time,
                rate_id,
                extra_towel,
                extra_pillow,
                extra_blanket,
                extra_single_bed,
                extra_double_bed,
                extra_person
            ) 
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *`,
    updateRoom: "UPDATE rooms SET status = $1, transaction_no = $2 WHERE room_no = $3",
    timedOutRoom: "UPDATE rooms SET status = $1 WHERE room_no = $2",
    checkOut: "UPDATE transactions SET dt_check_out = NOW() WHERE transaction_no = $1",
    timeOut: "UPDATE transactions SET dt_check_out = NOW() WHERE transaction_no = $1",
    getTxnByTxnNo: "SELECT * FROM transactions WHERE transaction_no = $1;",
    updateTransaction: `
        UPDATE 
            transactions 
        SET 
            duration = duration + $1,
            additional_time = additional_time + $1,
            extra_towel = extra_towel + $2,
            extra_pillow = extra_pillow + $3,
            extra_blanket = extra_blanket + $4,
            extra_single_bed = extra_single_bed + $5,
            extra_double_bed = extra_double_bed + $6,
            extra_person = extra_person + $7,
            bill = bill + $8
        WHERE 
            transaction_no = $9
        RETURNING *;`,
    deleteTransaction: "DELETE FROM transactions WHERE transaction_no = $1;",
    getActiveTxns: "SELECT * FROM transactions WHERE transaction_no IN (SELECT transaction_no FROM rooms WHERE status = 2)  ORDER BY room_no",
    updateTransactionRoom: "UPDATE transactions SET room_no = $1 WHERE transaction_no = $2;",
    getHistory: `
        SELECT t.*, u.first_name AS cashier, p.amount, p.dt_created
        FROM transactions t
        LEFT JOIN payments p ON t.transaction_no = p.transaction_no
        LEFT JOIN sessions s ON p.session_id = s.session_id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE
            (COALESCE($1, '') = '' OR t.transaction_no ILIKE '%' || $1::text || '%') AND
            (COALESCE($2, '') = '' OR t.dt_check_in >= $2::date) AND
            (COALESCE($3, '') = '' OR t.dt_check_in <= ($3::date + INTERVAL '1 day'))
        ORDER BY t.transaction_no DESC;
    `,
    cancelTxn: "UPDATE transactions SET dt_check_out = now(), bill = null, remarks = $1 WHERE transaction_no = $2;",
    insertPayment: "INSERT INTO payments (transaction_no, session_id, amount) VALUES ($1, $2, $3) RETURNING *;",
    getPaymentsByTxnNo: "SELECT * FROM payments WHERE transaction_no = $1",
    getActiveSession: "SELECT * FROM sessions WHERE logout_dt IS NULL AND user_id = $1;",
    getSessions: `
        SELECT s.*, u.first_name AS cashier, COALESCE(SUM(p.amount), 0) AS total_amount
        FROM sessions s
        LEFT JOIN payments p ON s.session_id = p.session_id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE
            (COALESCE($1, '') = '' OR user_id = $1::integer) AND
            (COALESCE($2, '') = '' OR login_dt >= $2::date) AND
            (COALESCE($3, '') = '' OR login_dt <= ($3::date + INTERVAL '1 day'))
        GROUP BY s.session_id, first_name
        ORDER BY s.session_id DESC;
    `,
    deletePaymentByTxnNo: "DELETE FROM payments WHERE transaction_no = $1;"
}

module.exports = {
    txn_query_set
}