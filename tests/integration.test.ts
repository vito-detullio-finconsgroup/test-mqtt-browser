import { connect, sum } from '../src/index';


test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(5);
});

const aedes = require('aedes')()
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
const port = 8888

ws.createServer({ server: httpServer }, aedes.handle)

httpServer.listen(port, function () {
  console.log('websocket server listening on port ', port)
})
