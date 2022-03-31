import * as mqtt from 'mqtt';

export const URL = 'mqtt://test.mosquitto.org';

export function connect(url: string): mqtt.MqttClient {
    const client = mqtt.connect(url);

    client.on('connect', () => {
        client.subscribe('presence', (err: Error) => {
            if (!err) {
                client.publish('presence', 'Hello mqtt');
            }
        })
    })

    client.on('message', (topic: string, message: Buffer) => {
        // message is Buffer
        console.log(message.toString());
        client.end();
    });

    return client;
}

export function sum(a: number, b: number): number {
    return a + b;
}
