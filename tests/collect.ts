import Aedes, { PublishPacket, Client } from 'aedes';
import { createServer, Server } from 'net';

const PORT = 8888;

const AEDES = Aedes();
let SERVER: Server;

export async function collect_setup(): Promise<void> {
    await new Promise<void>((resolve) => {
        SERVER = createServer(AEDES.handle);
        SERVER.listen(PORT, resolve);
    });
};

export async function collect_teardown(): Promise<void> {
    await Promise.all([
        new Promise<void>(AEDES.close.bind(AEDES)),
        await new Promise(SERVER.close.bind(SERVER))
    ]);
};

export const COLLECT_URL = `mqtt://localhost:${PORT}`;

function _listener(
    messages: string[],
    topic: string,
    packet: PublishPacket,
    client: Client
) {
    if (!client)
        return;
    if (packet.topic !== topic)
        return;

    messages.push(packet.payload.toString());
}

export async function collect(
    topic: string,
    suite: () => Promise<void>
): Promise<string[]> {
    const messages: string[] = [];
    const listener = _listener.bind(null, messages, topic);
    AEDES.on('publish', listener);
    try {
        await suite();
        return messages;
    }
    finally {
        AEDES.off('publish', listener);
    }
};
