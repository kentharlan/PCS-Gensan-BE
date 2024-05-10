const { Pg } = require('../Pg/Pg')
const { txn_query_set: qs } = require('../Query/txn-query-set')
const { check_out } = require('./checkout')
const { timeouts } = require('../timeouts/timeouts')
const { updateRoomPower, updateAllRoomPower } = require('./power');

const getTxn = async ({ txn_no }) => {
    let response = {
        result: null,
        error: null
    };

    try {
        const txn = await Pg.query(qs.getTxnByTxnNo, [txn_no])
        const payments = await Pg.query(qs.getPaymentsByTxnNo, [txn_no])

        const transaction = txn[0]
        const total_payment = payments.reduce((acc, payment) => acc + parseInt(payment.amount, 10), 0);

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
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person
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

        const bill = (parseInt(additional_time) * parseInt(rate.hourly))
            + parseInt(rate[base_time_name])
            + (parseInt(extra_towel) * parseInt(rates.extra_towel))
            + (parseInt(extra_pillow) * parseInt(rates.extra_pillow))
            + (parseInt(extra_blanket) * parseInt(rates.extra_blanket))
            + (parseInt(extra_single_bed) * parseInt(rates.extra_single_bed))
            + (parseInt(extra_double_bed) * parseInt(rates.extra_double_bed))
            + (parseInt(extra_person) * parseInt(rates.extra_person))

        const duration = parseInt(base_time) + parseInt(additional_time);

        // insert new transaction
        const insertTransaction = await Pg.query(qs.insertTransaction, [
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
        ]);
        const transaction = insertTransaction[0];

        // update room status
        await Pg.query(qs.updateRoom, [2, transaction.transaction_no, room_no])

        // setTimeout
        await timeouts.insertTimeout(transaction.room_no, transaction.dt_check_in, transaction.duration);

        // turn on room power
        await updateRoomPower(room_no, 2);

        response.result = transaction;
    } catch (error) {
        console.log(error.message)
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
            timed_out,
            additional_time,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person
        } = data;

        const [transaction] = await Pg.query(qs.getTxnByTxnNo, [transaction_no])
        const [room] = await Pg.query(qs.getRoomByRoomNo, [transaction.room_no])
        const [rate] = await Pg.query(qs.getRateByRateId, [transaction.rate_id])
        rate.garage = JSON.parse(rate.garage);
        rate.no_garage = JSON.parse(rate.no_garage);

        const additional_bill = (additional_time * rate[room.type].hourly)
            + (extra_towel * rate.extra_towel)
            + (extra_pillow * rate.extra_pillow)
            + (extra_blanket * rate.extra_blanket)
            + (extra_single_bed * rate.extra_single_bed)
            + (extra_double_bed * rate.extra_double_bed)
            + (extra_person * rate.extra_person)

        const updateResult = await Pg.query(qs.updateTransaction, [
            additional_time,
            extra_towel,
            extra_pillow,
            extra_blanket,
            extra_single_bed,
            extra_double_bed,
            extra_person,
            additional_bill,
            transaction_no
        ]);
        const result = updateResult[0];

        if (timed_out) await Pg.query(qs.updateRoom, [2, result.transaction_no, result.room_no])

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
        let records = []

        const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: "Asia/Manila" };

        for (const row of history) {
            let payment
            if (row.amount) {
                payment = {
                    cashier: row.cashier,
                    amount: row.amount,
                    payment_dt: new Date(row.dt_created).toLocaleString('en-US', formatOptions),
                };
            }

            const existingTxn = records.find(r => r.transaction_no === row.transaction_no);
            if (existingTxn) {
                if (payment) {
                    existingTxn.payments.push(payment);
                }
            } else {
                const parsedAmount = parseInt(row.bill, 10);
                if (!isNaN(parsedAmount)) {
                    totalAmount += parsedAmount;
                    totalRooms += 1;
                }

                const [room] = await Pg.query(qs.getRoomByRoomNo, [row.room_no]);
                const [rate] = await Pg.query(qs.getRateByRateId, [row.rate_id]);

                let room_rate
                switch (room.type) {
                    case "garage":
                        room_rate = JSON.parse(rate.garage);
                        break;
                    case "no_garage":
                        room_rate = JSON.parse(rate.no_garage)
                }
                let base_time_name
                switch (row.base_time) {
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

                records.push({
                    transaction_no: row.transaction_no,
                    room_no: row.room_no,
                    duration: row.duration,
                    rate: rate.name,
                    bill: parseInt(row.bill),
                    base_time: row.base_time,
                    base_time_amount: parseInt(room_rate[base_time_name]),
                    additional_time: row.additional_time,
                    additional_time_amount: parseInt(row.additional_time) * parseInt(room_rate.hourly),
                    extra_towel: row.extra_towel,
                    extra_towel_amount: parseInt(row.extra_towel) * parseInt(rate.extra_towel),
                    extra_pillow: row.extra_pillow,
                    extra_pillow_amount: parseInt(row.extra_pillow) * parseInt(rate.extra_pillow),
                    extra_blanket: row.extra_blanket,
                    extra_blanket_amount: parseInt(row.extra_blanket) * parseInt(rate.extra_blanket),
                    extra_single_bed: row.extra_single_bed,
                    extra_single_bed_amount: parseInt(row.extra_single_bed) * parseInt(rate.extra_single_bed),
                    extra_double_bed: row.extra_double_bed,
                    extra_double_bed_amount: parseInt(row.extra_double_bed) * parseInt(rate.extra_double_bed),
                    extra_person: row.extra_person,
                    extra_person_amount: parseInt(row.extra_person) * parseInt(rate.extra_person),
                    dt_check_in: new Date(row.dt_check_in).toLocaleString('en-US', formatOptions),
                    dt_check_out: row.dt_check_out ? new Date(row.dt_check_out).toLocaleString('en-US', formatOptions) : null,
                    remarks: row.remarks,
                    payments: payment ? [payment] : []
                });
            }
        }

        response.result = {
            totalAmount,
            totalRooms,
            records
        }
    } catch (error) {
        response.error = error.message;
    } finally {
        return response;
    }
}

const sessions = async ({ filters }) => {
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

        const sessions = await Pg.query(qs.getSessions, [user_id, start_date, end_date]);

        const formatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: "Asia/Manila" };
        for (const session of sessions) {
            session.login_dt = new Date(session.login_dt).toLocaleString('en-US', formatOptions)
            session.logout_dt = session.logout_dt ? new Date(session.logout_dt).toLocaleString('en-US', formatOptions) : null;
        }

        response.result = {
            records: sessions
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
    sessions
}