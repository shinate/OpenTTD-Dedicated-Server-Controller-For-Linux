import fs from 'fs';
import config from '../../config';
import OpenTTDServer from './OpenTTDServer';

let _SERVERS = null;

class ServerHub {

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

let _ServerHub = null;

export default (function () {
    if (_ServerHub === null) {
        _ServerHub = new ServerHub();
    }

    return _ServerHub;
})();