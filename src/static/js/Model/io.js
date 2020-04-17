/* global io */
class callbackChain {
    constructor() {
        this._CHAINS = {};
    }

    register(channel, cb) {
        if (!Object.prototype.hasOwnProperty.call(this._CHAINS, channel)) {
            this._CHAINS[channel] = [];
        }
        this._CHAINS[channel].push(cb);
    }

    get(channel) {
        return this._CHAINS[channel] || [];
    }
}

class client {
    constructor() {
        this.client = io('/socket');

        this.callbackChain = new callbackChain();

        this.on('message', response => {
            this.callbackChain.get(response.cmd).forEach(cb => {
                cb(response.data);
            });
        });
    }

    connect(...args) {
        this.client.on('connect', ...args);
    }

    on(channel, callback) {
        this.client.on(channel, callback);
    }

    once(channel, callback) {
        this.client.once(channel, callback);
    }

    send(cmd, params = {}) {
        this.client.emit('request', { ...params, cmd });
    }

    receive(cmd, cb) {
        // this.on('message', response => {
        //     if (response.cmd === cmd) {
        //         cb(response.data);
        //     }
        // });
        this.callbackChain.register(cmd, cb);
    }

    get id() {
        return this.client.id;
    }
}

let CLIENT = null;

export default (function () {
    if (CLIENT === null) {
        CLIENT = new client();

        CLIENT.connect(function () {
            console.log('socket.id: ', CLIENT.id);
        });

        CLIENT.on('message', function (response) {
            console.log('message', response);
        });
    }

    return CLIENT;
})();