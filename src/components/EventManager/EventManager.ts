import Event from "./Event";

interface eventCallback {
    (event: any): void;
}

export default class EventManager {
    eventListeners: { [key: string]: eventCallback[] } = {};
    static managers: { [key: string]: EventManager } = {};

    public subscribe = (eventClass: Function, handler: eventCallback):EventManager => {
        let name = eventClass.name;
        if (!this.eventListeners[name]) {
            this.eventListeners[name] = []
        }
        if (this.eventListeners[name].indexOf(handler) === -1) {
            this.eventListeners[name].push(handler);
        }

	return this;
    }

    public unsubscribe = (eventClass: Function, handlerToDelete: eventCallback):EventManager => {
        let name = eventClass.name;

        if (this.eventListeners[name]) {
            this.eventListeners[name] = this.eventListeners[name].filter((handler) => {
                return handler !== handlerToDelete
            })
        }

	return this;
    }

    dispatch(event: Event) {
        if (this.eventListeners[event.constructor.name]) {
            this.eventListeners[event.constructor.name].some((handler: eventCallback) => {
                if (!event.processingStopped) {
                    handler(event);
                }

                return event.processingStopped;
            })
        }
    }

    static instance(name: string = "main"): EventManager {
        if (!this.managers[name]) {
            this.managers[name] = new EventManager();
        }

        return this.managers[name];
    }
}
