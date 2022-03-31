import { connectAsync } from 'async-mqtt';

export const TOPIC = 'mytopic';

export async function publish(url: string, message: string): Promise<void> {
    const client = await connectAsync(url);
    try {
        client.publish(TOPIC, message);
    }
    finally {
        await client.end();
    }
}
