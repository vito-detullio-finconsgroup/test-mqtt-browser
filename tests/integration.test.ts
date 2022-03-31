import Aedes, { PublishPacket, Client } from 'aedes';
import { createServer, Server } from 'net';
import { publish, TOPIC } from '../src/index';

const AEDES = Aedes();
let SERVER: Server;

beforeAll(async () => {
    await new Promise<void>((resolve) => {
        SERVER = createServer(AEDES.handle);
        SERVER.listen(8888, resolve);
    });
});

afterAll(async () => {
    await Promise.all([
        new Promise<void>((resolve) => AEDES.close(resolve)),
        await new Promise((resolve) => SERVER.close(resolve))
    ]);
});


class Collector {
    collected: string[] = [];
    topic: string;

    constructor(topic: string) {
        this.topic = topic;
    }

    _listener(packet: PublishPacket, client: Client) {
        if (!client)
            return;

        this.collected.push(packet.payload.toString());
    }

    *collect() {
        const listener = this._listener.bind(this); // :(
        AEDES.on('publish', listener);
        try {
            yield
        }
        finally {
            AEDES.off('publish', listener);
        }
    }
}


test('publish', async () => {
    const collector = new Collector(TOPIC);
    for (const _ of collector.collect()) {
        await publish('mqtt://localhost:8888', 'message');
    }
    expect(collector.collected).toStrictEqual(['message']);
});
