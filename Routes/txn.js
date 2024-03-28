const express = require('express');
const txn_router = express.Router();

const { getTxn, checkIn, checkOut, update, cancel, transfer, active, history, init, pay, sessions } = require('../Services/txn-services')

// "txn"
txn_router.get('/:txn_no', async (req, res) => {
    const { result, error } = await getTxn({
        txn_no: req.params.txn_no
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/checkin"
txn_router.post('/checkin', async (req, res) => {
    const { result, error } = await checkIn({
        data: req.body
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/pay"
txn_router.post('/pay', async (req, res) => {
    const { result, error } = await pay({
        data: req.body
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/checkout"
txn_router.post('/checkout', async (req, res) => {
    const { result, error } = await checkOut({
        data: req.body
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/update"
txn_router.post('/update', async (req, res) => {
    const { result, error } = await update({
        data: req.body
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/transfer"
txn_router.post('/transfer', async (req, res) => {
    const { result, error } = await transfer({
        data: req.body
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/cancel"
txn_router.post('/cancel', async (req, res) => {
    const { result, error } = await cancel({
        data: req.body
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/txns/active"
txn_router.get('/txns/active', async (req, res) => {
    const { result, error } = await active();
    if (error) res.send(error)
    else res.json(result)
})

// "txn/history"
txn_router.post('/history', async (req, res) => {
    const { result, error } = await history({
        filters: req.query
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/init"
txn_router.post('/init', async (req, res) => {
    const { result, error } = await init({
        data: req.body
    });
    if (error) res.send(error)
    else res.json(result)
})

// "txn/sessions"
txn_router.post('/sessions', async (req, res) => {
    const { result, error } = await sessions({
        filters: req.query
    });
    if (error) res.send(error)
    else res.json(result)
})

module.exports = txn_router