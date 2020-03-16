import fs from 'fs';
import path from 'path';

export const dispatchRequest = function (socket) {
    return function (data) {
        console.log(data);
        if (data.hasOwnProperty('CMD')) {
            let cmd = data.CMD;
            let cmdFile = path.resolve(__dirname, `./cmd/${cmd}.js`);
            console.log(cmdFile);
            if (fs.existsSync(cmdFile)) {
                let ret = require(cmdFile).default(data);
                console.log(ret);
                socket.emit('REP', ret);
            }
        }
    }
};