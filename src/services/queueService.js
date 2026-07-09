"use strict";

const env = require("../config/env");
const cacheService = require("./cacheService");
const email = require("../utils/email");

let emailQueue;
let worker;
function getEmailQueue() {
    if (!env.env.queues.enabled)
        return null;
    if (!emailQueue) {
        const { Queue, Worker } = require("bullmq");
        const connection = cacheService.cacheService.getClient();
        if (!connection)
            return null;
        emailQueue = new Queue('email', { connection });
        worker = new Worker('email', async (job) => {
            await (0, email.sendEmail)(job.data.to, job.data.subject, job.data.html);
        }, { connection });
        worker.on('failed', (job, error) => console.error(`Email job ${job?.id} failed`, error));
    }
    return emailQueue;
}

exports.queueService = {
    async enqueueEmail(to, subject, html) {
        const queue = getEmailQueue();
        if (!queue) {
            await (0, email.sendEmail)(to, subject, html);
            return;
        }
        await queue.add('send', { to, subject, html }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
    },
};

