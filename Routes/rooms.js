const express = require('express');
const room_router = express.Router();

const { getRooms, getRoomByNo, updateRoom, getRoomByStatus } = require('../Services/rooms-services')


// "/rooms"
room_router.get('/', async (req, res) => {
    const { result, error } = await getRooms();
    if (error) res.send(error)
    else res.json(result)
})

//  "/rooms/[room_no]"
room_router.get('/:room_no', async (req, res) => {
    const { result, error } = await getRoomByNo({
        room_no: req.params.room_no
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/rooms/update/[room_no]"
room_router.put('/update/:room_no', async (req, res) => {
    const { result, error } = await updateRoom({
        data: req.body,
        room_no: req.params.room_no
    });
    if (error) res.send(error.body)
    else res.json(result)
})

// "/rooms/status"
room_router.get('/status/:status', async (req, res) => {
    const { result, error } = await getRoomByStatus({
        status: req.params.status
    });
    if (error) res.send(error)
    else res.json(result)
})

module.exports = room_router