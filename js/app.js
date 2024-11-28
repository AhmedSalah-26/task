const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let namesList = [];

wss.on('connection', (ws) => {
    console.log('connected');

    ws.send(JSON.stringify({ type: 'updateList', data: namesList }));

    ws.on('message', (message) => {
        const parsed = JSON.parse(message);

        if (parsed.type === 'addItem') {
            namesList.push(parsed.data);

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'updateList', data: namesList }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log("disconnected");
    });
});
