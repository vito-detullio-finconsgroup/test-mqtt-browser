import { collect_setup, collect_teardown, collect, COLLECT_URL } from './collect';

import { publish, TOPIC } from '../src/index';

beforeAll(collect_setup);
afterAll(collect_teardown);

test('publish should publish a message', async () => {
    const messages = await collect(TOPIC, async () => {
        await publish(COLLECT_URL, 'message');
    });
    expect(messages).toStrictEqual(['message']);
});
