/* global require */
import fs from 'fs';
import path from 'path';
import { result, isObject, isString } from 'lodash';
import { CMD } from './route';
import { ROOT_PATH } from './config';
import socketClientHUB from './Model/socketClientHUB';

export const dispatchRequest = function (socket) {
    return async function (request = {}) {
        console.log('>>', request);

        if (Object.prototype.hasOwnProperty.call(request, 'cmd')) {
            let cmd = result(CMD, request.cmd, 'exception@404');
            let cmdFile;
            let push = /#$/.test(cmd);
            let [classFile, method = 'default'] = cmd.replace('#', '').split('@');
            if (fs.existsSync(cmdFile = path.join(ROOT_PATH, `src/cmd/${classFile}.js`))) {
                let controller = new (require(cmdFile).default);
                if (method in controller) {
                    let ret = await controller[method](request);
                    let output = '';
                    if (isObject(ret)) {
                        output = JSON.stringify(ret).substr(0, 100) + ' ...';
                    } else if (isString(ret)) {
                        output = ret;
                    }
                    console.log('<< ', push, socket.client.conn.id, output);
                    if (push) {
                        socketClientHUB.push(request.cmd, ret);
                    } else {
                        socket.emit('message', {code: 200, cmd: request.cmd, data: ret});
                    }
                }
            }
        }
    };
};