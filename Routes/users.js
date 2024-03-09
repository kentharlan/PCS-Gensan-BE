const express = require('express');
const user_router = express.Router();

const { getUsers, getUserById, createUser, updateUser, updatePassword, deleteUser } = require('../Services/users-services')


// "/users"
user_router.get('/', async (req, res) => {
    const { result, error } = await getUsers();
    if (error) res.send(error)
    else res.json(result)
})

//  "/users/[id]"
user_router.get('/:id', async (req, res) => {
    const { result, error } = await getUserById({
        id: req.params.id
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/users/create"
user_router.post('/create', async (req, res) => {
    const { result, error } = await createUser({
        data: req.body
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/users/update/[id]"
user_router.put('/update/:id', async (req, res) => {
    const { result, error } = await updateUser({
        data: req.body,
        id: req.params.id
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/users/password/[id]"
user_router.put('/password/:id', async (req, res) => {
    const { result, error } = await updatePassword({
        data: req.body,
        id: req.params.id
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/users/delete/[id]"
user_router.delete('/delete/:id', async (req, res) => {
    const { result, error } = await deleteUser({
        id: req.params.id
    });
    if (error) res.send(error.body)
    else res.json(result)
})

module.exports = user_router