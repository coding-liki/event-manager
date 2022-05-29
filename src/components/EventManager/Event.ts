export default class Event {
    processingStopped: boolean = false;

    stopProcessing() {
        this.processingStopped = true;
    }
}