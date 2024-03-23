const { Pg } = require('../Pg/Pg')
const { txn_query_set: qs } = require('../Query/txn-query-set')
const { check_out } = require('./checkout')
const { timeouts } = require('../timeouts/timeouts')
const { updateRoomPower, updateAllRoomPower } = require('./power');

const getTxn = async ({txn_no}) => {
    let response = {
        result: null,
        error: null
    };
    
    try {
        const txn = await Pg.query(qs.getTxnByTxnNo, [txn_no])
        const payments = await Pg.query(qs.getPaymentsByTxnNo, [txn_no])

        const transaction = txn[0]
        const total_payment = payments.reduce((acc, payment) => acc + payment.amount, 0);

        transaction.bill = transaction.bill - total_payment

        response.result = transaction;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const checkIn = async ({ data }) => {
    let response = {
        result: null,
        error: null
    };
    let rate = null;
    let base_time_name = null

    try {
        const {
            room_no,
            rate_id,
            base_time,
            additional_time,
        } = data;

        const getRoom = await Pg.query(qs.getRoomByRoomNo, [room_no]);
        const room = getRoom[0];
        const getRate = await Pg.query(qs.getRateByRateId, [rate_id]);
        const rates = getRate[0];
        rates.garage = JSON.parse(rates.garage);
        rates.no_garage = JSON.parse(rates.no_garage);
        

        switch (room.type) {
            case "garage":
                rate = rates.garage;
                break;
            case "no_garage":
                rate = rates.no_garage;
        }

        switch (base_time) {
            case 3:
                base_time_name = "three";
                break;
            case 6:
                base_time_name = "six";
                break;
            case 12:
                base_time_name = "twelve";
                break;
            case 24:
                base_time_name = "twenty_four";
                break;
        }

        const bill = parseInt(additional_time) * parseInt(rate.hourly) + parseInt(rate[base_time_name]);
        const duration = parseInt(base_time) + parseInt(additional_time);

        // insert new transaction
        const insertTransaction = await Pg.query(qs.insertTransaction, [room_no, bill, duration, base_time, additional_time, rate_id]);
        const transaction = insertTransaction[0];

        // update room status
        await Pg.query(qs.updateRoom, [2, transaction.transaction_no, room_no])

        // setTimeout
        await timeouts.insertTimeout(transaction.room_no, transaction.dt_check_in, transaction.duration);

        // turn on room power
        await updateRoomPower(room_no, 2);

        response.result = transaction;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const pay = async ({ data }) => {
    let response = {
        result: null,
        error: null
    };
    try {
        const {
            transaction_no,
            user_id,
            amount
        } = data

        const session = await Pg.query(qs.getActiveSession, [user_id])
        const { session_id } = session[0];

        res = await Pg.query(qs.insertPayment, [transaction_no, session_id, amount])
        response.result = res[0]
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const checkOut = async ({ data }) => {
    let response = {
        result: null,
        error: null
    };
    try {
        const {
            room_no,
            bill,
            user_id
        } = data

        if (bill && bill > 0) {
            const room = await Pg.query(qs.getRoomByRoomNo, [room_no])
            const transaction_no = room[0].transaction_no
    
            const session = await Pg.query(qs.getActiveSession, [user_id])
            const session_id = session[0].session_id
    
            await Pg.query(qs.insertPayment, [transaction_no, session_id, bill])
        }

        await check_out(room_no);

        await timeouts.cancelTimeout(room_no)

        response.result = "Check out succesful"
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const update = async ({ data }) => {
    let response = {
        result: null,
        error: null
    };
    try {
        const {
            transaction_no,
            additional_time,
            new_bill
        } = data;

        const updateResult = await Pg.query(qs.updateTransaction, [additional_time, new_bill, transaction_no]);
        const result = updateResult[0];

        // setTimeout
        await timeouts.cancelTimeout(result.room_no);
        await timeouts.insertTimeout(result.room_no, result.dt_check_in, result.duration);

        response.result = result;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const cancel = async ({ data }) => {
    let response = {
        result: null,
        error: null
    };
    try {
        const {
            room_no,
            transaction_no,
            user_id
        } = data;

        const getUser = await Pg.query(qs.getUserById, [user_id]);
        const user = getUser[0]
        const remarks = `Cancelled by ${user.first_name}`

        // Update Room
        await Pg.query(qs.updateRoom, [3, null, room_no])
        // Delete Payment Record if any
        await Pg.query(qs.deletePaymentByTxnNo, [transaction_no])
        // Update Transaction
        await Pg.query(qs.cancelTxn, [remarks, transaction_no]);
        // Cancel Timeout
        await timeouts.cancelTimeout(room_no);

        await updateRoomPower(room_no, 3);

        response.result = "Succesfuly Cancelled the room transaction";
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const transfer = async ({ data }) => {
    let response = {
        result: null,
        error: null
    };
    try {
        const {
            from,
            to,
            transaction_no
        } = data;

        const txnRow = await Pg.query(qs.getTxnByTxnNo, [transaction_no]);
        const txn = txnRow[0];

        // Update rooms
        await Pg.query(qs.updateRoom, [3, null, from]); // update previous room
        await Pg.query(qs.updateRoom, [2, transaction_no, to]); // update transfer room

        // Update transaction
        await Pg.query(qs.updateTransactionRoom, [to, transaction_no])

        // Cancel Timeout
        await timeouts.cancelTimeout(from);
        // Set Timeout
        await timeouts.insertTimeout(to, txn.dt_check_in, txn.duration);

        // update room power
        await updateRoomPower(from, 3);
        await updateRoomPower(to, 2);

        response.result = "Succesful Room Transfer.";
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const active = async () => {
    let response = {
        result: null,
        error: null
    };
    try {
        const activeTxns = await Pg.query(qs.getActiveTxns);

        response.result = activeTxns;
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const history = async ({ filters }) => {
    let response = {
        result: null,
        error: null
    };
    try {
        const {
            search,
            start_date,
            end_date
        } = filters

        let history = await Pg.query(qs.getHistory, [search, start_date, end_date]);

        let totalAmount = 0;
        let totalRooms = 0;

        history = history.map(txn => {
            const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: "Asia/Manila" };
            const formattedCheckIn = new Date(txn.dt_check_in).toLocaleString('en-US', formatOptions);
            const formattedCheckOut = txn.dt_check_out ? new Date(txn.dt_check_out).toLocaleString('en-US', formatOptions) : null;

            const parsedAmount = parseInt(txn.bill, 10);
            if (!isNaN(parsedAmount)) {
                totalAmount += parsedAmount;
                totalRooms += 1;
            }

            return {
                ...txn,
                dt_check_in: formattedCheckIn,
                dt_check_out: formattedCheckOut
            };
        });

        response.result = {
            totalAmount,
            totalRooms,
            records: history
        }
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const payments = async ({ filters }) => {
    let response = {
        result: null,
        error: null
    };
    try {
        const {
            user_id,
            start_date,
            end_date
        } = filters

        const payments = await Pg.query(qs.getPayments, [user_id, start_date, end_date]);
        const records = []
        let totalAmount = 0;

        for (const payment of payments) {
            const parsedAmount = parseInt(payment.amount, 10);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                continue
            }

            totalAmount += parsedAmount;

            const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: "Asia/Manila" };
            const formattedDate = new Date(payment.dt_created).toLocaleString('en-US', formatOptions);
            payment.dt_created = formattedDate;

            const formatLogOptions = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: "Asia/Manila" };
            const formattedLogDate = new Date(payment.dt_created).toLocaleString('en-US', formatLogOptions);
            payment.login_dt = formattedLogDate;

            const cashier = await Pg.query(qs.getUserById, [payment.user_id])
            payment.cashier = cashier[0]?.first_name

            records.push(payment)
        }

        response.result = {
            totalAmount,
            records
        };
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const init = async () => {
    let response = {
        result: null,
        error: null
    };
    try {
        await updateAllRoomPower();
        console.log("Successfully initialized.")
        response.result = "Successfully initialized.";
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

module.exports = {
    getTxn,
    checkIn,
    checkOut,
    update,
    cancel,
    transfer,
    active,
    history,
    init,
    pay,
    payments
}