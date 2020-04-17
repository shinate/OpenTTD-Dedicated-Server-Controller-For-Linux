import process from 'process';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import config from './config';
import { dispatchRequest } from './request';
import socketClientHUB from './Model/socketClientHUB';
import Crond from './Model/Crond';
import Servers from './cmd/Servers';
import ServerHub from './Model/ServerHub';

console.log('Configuration:', config);

const app = express();
const server = http.createServer(app);
const SIO = socketIO(server);

const SERVERS = {};

SIO
    .of('/socket')
    .on('connection', function (socket) {
        socketClientHUB.connect(socket);
        socket.emit('message', 'Welcome!');
        socket.on('request', dispatchRequest(socket));
        socket.on('disconnect', function (reason) {
            switch (reason) {
                case 'transport close':
                    socketClientHUB.disconnect(socket);
                    socket = null;
                    break;
                case '':
                default:
                    console.log('');
                    break;
            }
        });
    });

app.use(express.static(config.PUBLIC_PATH));

server.listen(3000);

//Crond
Crond.add('servers_push', '*/10 * * * * *', function () {
    socketClientHUB.push('push', (new Servers()).default());
}, null, true);

Crond.add('server_stats', '*/30 * * * * *', function () {
    ServerHub.reflush(null, 'getProcessStats');
}, null, true);

// have save success callback
// Crond.add('server_stats', '0 */1 * * * *', function () {
//     ServerHub.reflush(null, 'getSaves');
// }, null, true);

// const sub = spawn('dir');
// //
// // sub.stdout.on('message', (data) => {
// //     console.log(`Received chunk ${data}`);
// // });

// console.log(os.cpus().length);

// console.log(process.env.ComSpec);
//
// const program = path.resolve(__dirname, '../kernel/openttd');
// const parameters = ['-D', '-x', '-c', path.resolve(__dirname, '../servers/test/openttd.cfg')];
// const options = {
//     stdio: ['pipe', 'pipe', 'pipe']
//     // serialization: 'json',
//     // shell: true
// };
//
// const child = spawn(program, parameters, options);
//
// child.stdout.on('data', (data) => {
//     process.stdout.write(`stdout: ${data}`);
// });
//
// child.stderr.on('data', (data) => {
//     process.stdout.write(`stderr: ${data}`);
// });
//
// child.on('close', (code) => {
//     console.log(`子进程退出，退出码 ${code}`);
// });

process.stdin.on('readable', () => {
    let chunk;
    // Use a loop to make sure we read all available data.
    while ((chunk = process.stdin.read()) !== null) {
        for (let name in SERVERS) {
            SERVERS[name].send(chunk);
        }
    }
});