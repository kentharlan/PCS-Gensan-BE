const express = require('express');
const login_router = express.Router();

const { login } = require('../Services/login-services')

// "/login"
login_router.post('/', async (req, res) => {
    const { result, error } = await login({
        data: req.body
    });
    if (error) res.status(error.statusCode).send(error)
    else res.json(result)
})

module.exports = login_router