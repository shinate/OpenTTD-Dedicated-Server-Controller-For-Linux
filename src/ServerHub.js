import fs from 'fs';
import path from 'path';
import config from '../config';
import ini from 'ini';
import { isEmpty } from 'lodash';
import OpenTTDServer from './OpenTTDServer';

let _SERVERS = null;

export default class ServerHub {

    constructor() {
        if (_SERVERS === null) {
            _SERVERS = this.getServerConfigurations();
        }
    }

    getServerConfigurations() {
        let servers = fs.readdirSync(config.SERVER_PATH, {withFileTypes: true});

        servers = servers.map(dir => {
            if (!dir.isDirectory() || /^\.{1,2}/.test(dir.name)) {
                return null;
            }

            return new OpenTTDServer(dir.name);
        }).filter(a => a);

        return servers;
    }

    servers() {
        return _SERVERS;
    }
}