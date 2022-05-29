# Event Manager

The simplest way to add Events to your project

## Installation

```shell
npm install @coding-liki/event-manager
```

## Usage

### Creating Events

Simple event can be created by extending ``Event`` class :

```ts
import {Event} from "@coding-liki/event-manager";

class SimpleEvent extends Event {
}
```

Of course, events can contain any data:

```ts
import {Event} from "@coding-liki/event-manager";

class WithDataEvent extends Event {
    constructor(private message: string) {
        super();
    }

    getMessage(): string {
        return this.message;
    }
}
```

### Getting EventManager Instance

You can have not one but many event managers. All of them are available from ``EventManager.instance()`` method:

```ts
import {EventManager} from "@coding-liki/event-manager";

let mainEventManager = EventManager.instance(); // getting "main" instance
let otherEventManager = EventManager.instance("other"); // getting "other" instance
```

Each instance has its own events to subscribers map, so you can separate event dispatching for particular parts of your
system.

### Dispatching Events

The simplest dispatching of ``SimpleEvent`` will be:

```ts
import {EventManager} from "@coding-liki/event-manager";

let mainEventManager = EventManager.instance();

mainEventManager.dispatch(new SimpleEvent());
```

More complex events, such as ``WithDataEvent`` are not harder to dispatch:

```ts
import {EventManager} from "@coding-liki/event-manager";

let mainEventManager = EventManager.instance();

mainEventManager.dispatch(new WithDataEvent("my message"));
```

### Subscribing And Unsubscribing

Any ``Callable`` like ``(event: any): void``  can be subscribed to and unsubscribed from any ``Event``.

To subscribe use ``EventManager.subscibe(Event, handler)``

To unsubscribe use ``EventManager.unsubscribe(Event, handler)`` :

```ts
import {EventManager} from "@coding-liki/event-manager";

let mainEventManager = EventManager.instance();

let simpleHandler = (event: SimpleEvent) => {
    console.log("Simple event handeled");
};

mainEventManager.subscibe(SimpleEvent, simpleHandler); // Now when we will dispatch SimpleEvent, this simpleHandler will be called 

mainEventManager.dispatch(new SimpleEvent()); // "Simple event handeled"

mainEventManager.unsubscibe(SimpleEvent, simpleHandler); // Now when we will dispatch SimpleEvent, this simpleHandler will NOT be called 

mainEventManager.dispatch(new SimpleEvent()); // no output

```

### Stop Processing

Event has ``stopProcessing()`` method. After calling it in any handler, other handlers will NOT be called:

```ts
import {EventManager} from "@coding-liki/event-manager";

let mainEventManager = EventManager.instance();

let simpleHandler = (event: SimpleEvent) => {
    console.log("Simple event handeled");
    event.stopProcessing
};

let anotherHandler = (event: SimpleEvent) => {
    console.log("Simple event another handeled");
};

/** Order Matters **/
mainEventManager.subscibe(SimpleEvent, simpleHandler);
mainEventManager.subscibe(SimpleEvent, anotherHandler);

mainEventManager.dispatch(new SimpleEvent()); // "Simple event handeled". anotherHandler will not be called.
```