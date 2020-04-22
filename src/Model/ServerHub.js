import fs from 'fs';
import config from '../config';
import OpenTTDServer from './OpenTTDServer';
import { keyBy } from 'lodash';

let _SERVERS = null;

class ServerHub {

    constructor() {
        if (_SERVERS === null) {
            _SERVERS = this.getServerConfigurations();
        }
    }

    getServerConfigurations() {
        let servers = fs.readdirSync(config.SERVER_PATH, { withFileTypes: true });

        servers = servers.map(dir => {
            if (!dir.isDirectory() || /^\.{1,2}/.test(dir.name)) {
                return null;
            }

            return new OpenTTDServer(dir.name, {
                stdout: function (data) {
                    console.log(data.toString().trim());
                },
                stderr: function (data) {
                    console.log(data.toString().trim());
                },
                close : function (code) {
                    console.log(`child process exited with code ${code}`);
                }
            });
        }).filter(a => a);

        return keyBy(servers, 'name');
    }

    servers() {
        return _SERVERS;
    }

    get(name) {
        return _SERVERS[name];
    }

    start(name = null, save = null) {
        this.get(name).start(save);
    }

    async stop(name = null) {
        await this.get(name).stop();
    }

    save(name) {
        this.get(name).save();
    }

    reflush(name = null, method = 'reflush') {
        if (name) {
            let server = this.get(name);
            if (method in server) {
                server[method]();
            }
        } else {
            for (let key in _SERVERS) {
                if (Object.prototype.hasOwnProperty.call(_SERVERS, key)) {
                    let server = _SERVERS[key];
                    if (method in server) {
                        server[method]();
                    }
                }
            }
        }
    }

    reflushProcesses(name = null) {
        if (name) {
            let server = this.get(name);
            server.getProcessStats();
        } else {
            for (let key in _SERVERS) {
                if (Object.prototype.hasOwnProperty.call(_SERVERS, key)) {
                    let server = _SERVERS[key];
                    server.getProcessStats();
                }
            }
        }
    }
}

let _ServerHub = null;

export default (function () {
    if (_ServerHub === null) {
        _ServerHub = new ServerHub();
    }

    return _ServerHub;
})();