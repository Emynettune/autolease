"use strict";
const data_source = require("../database/data-source");
const enums = require("../types/enums");
const helpers = require("../utils/helpers");
const paystack = require("../utils/paystack");
const authModel = require("./authModel");
const env = require("../config/env");
exports.paymentModel = {
    async initialize(bookingId, customerId) {
        const booking = await (0, data_source.getRepo)('Booking').findOne({
            where: { id: bookingId, customerId }, relations: ['payment', 'customer'],
        });
        if (!booking)
            throw new helpers.AppError('Booking not found', 404);
        if (booking.status !== enums.BookingStatus.AWAITING_PAYMENT)
            throw new helpers.AppError('book before trying to make payment', 400);
        if (!booking.payment)
            throw new helpers.AppError('Payment record not found for booking', 404);
        if (booking.payment.status === enums.PaymentStatus.SUCCESS)
            throw new helpers.AppError('Payment already completed', 400);
        if (!booking.payment.paystackReference)
            throw new helpers.AppError('Payment reference missing', 500);
        const result = await (0, paystack.initializePayment)(booking.customer.email, Number(booking.payment.amount), booking.payment.paystackReference, { bookingId: booking.id, customerId });
        return {
            authorizationUrl: result.authorization_url,
            reference: booking.payment.paystackReference,
            amount: booking.payment.amount,
        };
    },
    async verify(reference) {
        const paystackData = await (0, paystack.verifyPayment)(reference);
        if (paystackData.status !== 'success')
            throw new helpers.AppError('Payment not successful', 400);
        return data_source.getRepo('Payment').transaction(async (manager) => {
            const payment = await manager.getRepository('Payment').findOne({
                where: { paystackReference: reference }, lock: { mode: 'pessimistic_write' },
            });
            if (!payment)
                throw new helpers.AppError('Payment not found', 404);
            if (payment.status === enums.PaymentStatus.SUCCESS)
                return { alreadyProcessed: true, payment };
            const booking = await manager.getRepository('Booking').findOne({
                where: { id: payment.bookingId }, relations: ['vehicle'], lock: { mode: 'pessimistic_write' },
            });
            if (!booking)
                throw new helpers.AppError('Booking not found', 404);
            payment.status = enums.PaymentStatus.SUCCESS;
            payment.paystackTransactionId = String(paystackData.id);
            payment.metadata = paystackData;
            await manager.getRepository('Payment').save(payment);
            booking.status = enums.BookingStatus.PAID;
            await manager.getRepository('Booking').save(booking);
            await (0, authModel.creditOwnerWallet)(manager, booking.vehicle.ownerId, Number(payment.amount), env.platformCommissionRate, reference, `Rental payment for booking ${booking.id}`);
            return { payment, booking };
        });
    },
    async handleWebhook(payload, signature) {
        const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
        if (!(0, paystack.verifyWebhookSignature)(raw, signature))
            throw new helpers.AppError('Invalid webhook signature', 401);
        const event = typeof payload === 'string' ? JSON.parse(payload) : payload;
        if (event.event === 'charge.success')
            await this.verify(event.data.reference);
        return { received: true };
    },
};

module.exports = { paymentModel: exports.paymentModel };
//# sourceMappingURL=paymentModel.js.map