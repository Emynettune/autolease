"use strict";

const app = __importDefault(require("./app"));
const dataSource = require("./database/data-source");
const bookingModel = require("./models/bookingModel");
const env = require("./config/env");
const scheduleSevice = require("./services/schedulerService");
const websocketService = require("./services/websocketService");
async function bootstrap() {
    await (0, dataSource.initializeDatabase)();
    console.log('Database connected');
    const server = app.default.listen(env.env.port, () => {
        console.log(`AutoLease API running on port ${env.env.port} [${env.env.nodeEnv}]`);
    });
    websocketService.websocketService.attach(server);
    scheduleSevice.schedulerService.start();
    setInterval(() => bookingModel.bookingModel.activateCompletedBookings().catch(console.error), 60 * 60 * 1000);
}
bootstrap().catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map
