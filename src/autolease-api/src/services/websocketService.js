"use strict";

const eventBus = require("../utils/eventBus");

const websocketService = {
    attach(server) {
        const { WebSocketServer } = require("ws");
        const wss = new WebSocketServer({ server, path: '/ws' });
        wss.on('connection', (socket) => {
            socket.send(JSON.stringify({ type: 'connected', data: { message: 'AutoLease websocket connected' } }));
        });
        eventBus.subscribe('notification', (payload) => {
            const message = JSON.stringify({ type: 'notification', data: payload });
            for (const client of wss.clients) {
                if (client.readyState === client.OPEN)
                    client.send(message);
            }
        });
        return wss;
    },
};


module.exports = { websocketService: websocketService };
