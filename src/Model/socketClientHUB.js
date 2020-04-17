class socketClientHUB {
    constructor() {
        this._HANDLE = {};
    }

    connect(socket) {
        this._HANDLE[socket.client.conn.id] = socket;
    }

    disconnect(socket) {
        delete this._HANDLE[socket.client.conn.id];
    }

    push(cmd, data) {
        for (let id in this._HANDLE) {
            if (Object.prototype.hasOwnProperty.call(this._HANDLE, id)) {
                this._HANDLE[id].emit('message', {
                    code: 200,
                    cmd,
                    data
                });
            }
        }
    }
}

let _HANDLE = null;

export default (function () {
    if (_HANDLE === null) {
        _HANDLE = new socketClientHUB();
    }

    return _HANDLE;
})();