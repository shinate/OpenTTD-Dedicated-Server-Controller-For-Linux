import fs from 'fs';
import path from 'path';
import config from '../../config';
import { spawn } from 'child_process';
import ini from 'ini';
import { isEmpty } from 'lodash';

const defaultOptions = {};

export default class OpenTTDServer {

    constructor(name, options = {}) {
        this._HANDLE = null;
        this.name = name;
        this.options = {...defaultOptions, ...options};

        this.init();
    }

    init() {
        this.serverPath = path.join(config.SERVER_PATH, this.name);
        this.configFilePath = path.join(this.serverPath, 'openttd.cfg');
        let configContent = null;
        if (fs.existsSync(this.configFilePath)) {
            configContent = ini.parse(fs.readFileSync(this.configFilePath, 'utf-8'));
            if (isEmpty(configContent)) {
                configContent = null;
            }
        }

        this.configContent = configContent;
        this.isValidConfigure = configContent !== null;
    }

    getStatus() {

    }

    start() {

        if (!this.isValidConfigure) {
            return;
        }

        this.spawn();

        if (this.options.stdout) {
            this.bindStdout(this.options.stdout);
        }

        if (this.options.stderr) {
            this.bindStderr(this.options.stderr);
        }
    }

    stop() {

    }

    spawn() {
        this._HANDLE = spawn(config.KERNEL, ['-D', '-x', '-c', this.configFilePath], {
            stdio: 'pipe'
        });
    }

    exec() {
        this._HANDLE = spawn(config.KERNEL, ['-D', '-x', '-c', this.configFilePath], {
            stdio: 'pipe'
        });
    }

    bindStdout(cb = null) {
        cb !== null && this._HANDLE.stdout.on('data', cb);
    }

    bindStderr(cb = null) {
        cb !== null && this._HANDLE.stderr.on('data', cb);
    }

    send(command = null) {
        if (command !== null) {
            this._HANDLE.stdin.write(command);
        }
    }

    save() {

    }

    getAllSaves() {

    }
}