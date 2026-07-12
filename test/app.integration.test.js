"use strict";
const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const app = require("../src/app");
const app = require("../src/app");

function request(server, path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const address = server.address();
        const req = http.request({ hostname: '127.0.0.1', port: address.port, path, method }, (res) => {
          (res) => {
            let body = '';
            res.on('data', (chunk) => {body += chunk; });
            res.on('end', () => resolve({ statusCode: res.statusCode, body }));
          }
        });
        req.on('error', reject);
        req.end();
    });
}

test('GET /health returns ok', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    try {
        const response = await request(server, '/health');
        assert.equal(response.statusCode, 200);
        assert.deepEqual(JSON.parse(response.body), { success: true, message: 'ok' });
    }
    finally {
        await new Promise((resolve) => server.close(resolve));
    }
});
