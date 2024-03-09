const { Ws } = require("../RPI/ws");
const { Pg } = require("../Pg/Pg");
const { rooms_query_set: qs } = require('../Query/rooms-query-set')

exports.updateRoomPower = async (room, status) => {
  const { RPI, command } = await Ws.generateRPICommand(room, status);
  const commandArray = [command];
  await Ws.sendCommand(RPI, JSON.stringify(commandArray));
}

exports.updateAllRoomPower = async () => {
  const rpi1CommandArray = [];
  const rpi2CommandArray = [];
  const rpi3CommandArray = [];
  const rooms = await Pg.query(qs.getRooms);

  for (const room of rooms) {
    const { RPI, command } = await Ws.generateRPICommand(room.room_no, room.status);

    switch(RPI) {
      case 1: rpi1CommandArray.push(command); break;
      case 2: rpi2CommandArray.push(command); break;
      case 3: rpi3CommandArray.push(command); break;
    }
  }

  await Ws.sendCommand(1 ,JSON.stringify(rpi1CommandArray));
  await Ws.sendCommand(2 ,JSON.stringify(rpi2CommandArray));
  await Ws.sendCommand(3 ,JSON.stringify(rpi3CommandArray));
}