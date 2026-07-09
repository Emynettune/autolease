"use strict";

const axios = __importDefault(require("axios"));
const crypto = __importDefault(require("crypto"));
const env = require("../config/env");
const paystackApi = axios.default.create({
    baseURL: 'https://api.paystack.co',
    headers: { Authorization: `Bearer ${env.env.paystack.secretKey}` },
});
async function initializePayment(email, amount, reference, metadata) {
    const { data } = await paystackApi.post('/transaction/initialize', {
        email,
        amount: Math.round(amount * 100),
        reference,
        callback_url: `${env.env.apiUrl}/api/v1/payments/callback`,
        metadata,
    });
    return data.data;
}
async function verifyPayment(reference) {
    const { data } = await paystackApi.get(`/transaction/verify/${reference}`);
    return data.data;
}
function verifyWebhookSignature(payload, signature) {
    const hash = crypto.default.createHmac('sha512', env.env.paystack.secretKey).update(payload).digest('hex');
    return hash === signature;
}
async function resolveBankAccount(accountNumber, bankCode) {
    const { data } = await paystackApi.get('/bank/resolve', {
        params: { account_number: accountNumber, bank_code: bankCode },
    });
    return data.data;
}

module.exports = {
    initializePayment,
    verifyPayment,
    verifyWebhookSignature,
    resolveBankAccount
};
//# sourceMappingURL=paystack.js.map