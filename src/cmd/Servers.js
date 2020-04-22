import ServerHub from '../Model/ServerHub';
import { mapValues, pick, cloneDeep } from 'lodash';

const configContentAllow = [
    'network.server_name',
    'network.server_port',
    'version.version_string',
    'version.version_number'
];

const configContentFilter = (content) => pick(content, configContentAllow);

export default class Servers {

    default() {
        let servers = cloneDeep(ServerHub.servers());
        return mapValues(servers, server => {
            server.configContent = configContentFilter(server.configContent);
            return server;
        });
    }

    start(request) {
        let name = request.params.name;
        delete request.params.name;
        let save = request.params.file;
        ServerHub.start(name, save ? request.params : null);
        let ret = {};
        ret[name] = pick(ServerHub.get(name), [ 'stats', 'process' ]);
        return ret;
    }

    async stop(request) {
        let name = request.params.name;
        await ServerHub.stop(name);

        let ret = {};
        ret[name] = pick(ServerHub.get(name), [ 'stats', 'process' ]);

        return ret;
    }

    save(request) {
        let name = request.params.name;
        ServerHub.save(name);

        return null;
    }
}