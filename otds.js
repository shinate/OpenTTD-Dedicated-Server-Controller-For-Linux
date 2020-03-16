import { spawn } from 'child_process';
import path from 'path';
import process from 'process';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import config from './config';
import OpenTTDServer from './src/Model/OpenTTDServer'
import { dispatchRequest } from './src/request';

console.log('Configuration:');
console.log(config);

const app = express();
const server = http.createServer(app);
const SIO = socketIO(server);

const SERVERS = {}

SIO.of('/socket').on('connection', function (socket) {
    socket.emit('message', 'Welcome!');

    socket.on('CMD', function (data) {
        console.log(data);
        SERVERS[data.name] = new OpenTTDServer(data.name, {
            stdout: data => {
                process.stdout.write(`${data}`);
                socket.emit('news', `${data}`);
            },
            stderr: data => {
                process.stdout.write(`${data}`);
                socket.emit('news', `${data}`);
            }
        });
    });

    socket.on('REQ', dispatchRequest(socket));
});

app.use(express.static(config.PUBLIC_PATH));

server.listen(3000);

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