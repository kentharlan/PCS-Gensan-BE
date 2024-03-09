const express = require('express');
const rate_router = express.Router();

const { getRates, getRateById, createRate, updateRate, deleteRate } = require('../Services/rates-services')


// "/rates"
rate_router.get('/', async (req, res) => {
    const { result, error } = await getRates();
    if (error) res.send(error)
    else res.json(result)
})

//  "/rates/[id]"
rate_router.get('/:id', async (req, res) => {
    const { result, error } = await getRateById({
        id: req.params.id
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/rates/create"
rate_router.post('/create', async (req, res) => {
    const { result, error } = await createRate({
        data: req.body
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/rates/update/[id]"
rate_router.put('/update/:id', async (req, res) => {
    const { result, error } = await updateRate({
        data: req.body,
        id: req.params.id
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/rates/delete/[id]"
rate_router.delete('/delete/:id', async (req, res) => {
    const { result, error } = await deleteRate({
        id: req.params.id
    });
    if (error) res.send(error.body)
    else res.json(result)
})

module.exports = rate_router