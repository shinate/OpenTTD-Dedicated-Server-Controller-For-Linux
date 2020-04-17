import { CronJob } from 'cron';

class Crond {
    constructor() {
        this._CROND = {};
    }

    register(name, ...args) {
        this._CROND[name] = new CronJob(...args);
    }

    unregister(name) {
        if (Object.prototype.hasOwnProperty.call(this._CROND, name)) {
            this._CROND[name] = null;
            delete this._CROND[name];
        }
    }

    add(name, ...args) {
        this.register(name, ...args);
        this.start(name);
    }

    remove(name) {
        if (Object.prototype.hasOwnProperty.call(this._CROND, name)) {
            this._CROND[name].stop();
            this.unregister(name);
        }
    }

    start(name) {
        if (name) {
            this._CROND[name].start();
        } else {
            for (let name in this._CROND) {
                if (Object.prototype.hasOwnProperty.call(this._CROND, name)) {
                    this._CROND[name].start();
                }
            }
        }
    }

    stop(name) {
        if (name) {
            this._CROND[name].stop();
        } else {
            for (let name in this._CROND) {
                if (Object.prototype.hasOwnProperty.call(this._CROND, name)) {
                    this._CROND[name].stop();
                }
            }
        }
    }
}

let _CROND = null;

export default (function () {
    if (_CROND === null) {
        _CROND = new Crond();
    }

    return _CROND;
})();