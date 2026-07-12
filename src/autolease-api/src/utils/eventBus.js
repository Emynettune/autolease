"use strict";
const EventEmitter = require("events");

class AppEventBus extends EventEmitter {
    publish(eventName, payload) {
        this.emit(eventName, payload);
    }
    subscribe(eventName, handler) {
        this.on(eventName, handler);
        return () => this.off(eventName, handler);
    }
}

module.exports = new AppEventBus();

