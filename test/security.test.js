"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const { sanitizeRequest } = require("../src/middlewares/security");
const jwt = require("../src/utils/jwt");

test('sanitizeRequest escapes html in request inputs', async () => {
    const req = {
        body: { name: ' <script>alert(1)</script> ' },
        query: {},
        params: {},
    };
    await new Promise((resolve) => sanitizeRequest(req, {}, resolve));
    console.log("sanitized output:", req.body.name);

    assert.equal(req.body.name, '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('access tokens include a jwt id for blacklist support', () => {
    const token = jwt.signAccessToken({ id: 'user-id', email: 'u@example.com', role: 'CUSTOMER' });
    const payload = jwt.verifyAccessToken(token);
    assert.equal(typeof payload.jti, 'string');
    assert.ok(payload.jti.length > 0);
});



