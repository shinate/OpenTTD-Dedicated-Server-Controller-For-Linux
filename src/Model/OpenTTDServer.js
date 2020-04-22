import fs from 'fs';
import path from 'path';
import config from '../config';
import { spawn, exec, execSync } from 'child_process';
import ini from 'ini';
import { isEmpty, defaultsDeep, zipObject, sortBy } from 'lodash';
import moment from 'moment';
import commandFeedback from './commandFeedback';

const DEFAULT_OPTIONS = {};

const HANDLE = Symbol('HANDLE');
const COMMAND_FEEDBACK = Symbol('COMMAND_FEEDBACK');

export default class OpenTTDServer {

    constructor(name, options = {}) {
        this.name = name;
        this.options = defaultsDeep(DEFAULT_OPTIONS, options);

        this.init();
        this.bind();
        this.getAll();
    }

    init() {
        this[HANDLE] = null;
        this[COMMAND_FEEDBACK] = new commandFeedback();
        this.serverPath = path.join(config.SERVER_PATH, this.name);
        this.configFilePath = path.join(this.serverPath, 'openttd.cfg');
        this.configFileLastModified = 0;
        this.savePath = path.join(this.serverPath, 'save');
        this.saves = [];
    }

    bind() {
        this[COMMAND_FEEDBACK].on('saved', () => {
            this.getSaves();
        });
    }

    getAll() {
        this.getConfigContent();
        this.getProcessStats();
        this.getStats();
        this.getSaves();
    }

    reflush() {
        this.getAll();
    }

    /**
     * get contents of openttd.cfg
     */
    getConfigContent() {
        if (fs.existsSync(this.configFilePath)) {
            let stats = fs.statSync(this.configFilePath);
            if (this.configFileLastModified < stats.mtimeMs) {
                this.configContent = ini.parse(fs.readFileSync(this.configFilePath, 'utf-8'));
                this.configFileLastModified = stats.mtimeMs;
            }
        }
    }

    getProcessStats() {
        let h = null;
        try {
            let r = execSync(`${path.join(config.SCRIPT_PATH, 'getProcesses.sh')} ${this.configFilePath}`).toString().trim();
            if (r) {
                h = r.split(',').map(o => o.trim());
                h = zipObject([ 'memory', 'pid', 'ppid', 'start_time', 'cpu', 'time' ], h);
                h.start_time = moment(h.start_time, 'ddd MMM D HH:mm:ss YYYY').valueOf();
                h.cpu *= 0.01;
                h.time *= 1000; // millisecond
                h.memory = parseInt(h.memory) * 1024;
                h.time = moment(`1970 1 ${h.time}`, 'YYYY MM DD-hh:mm:ss').utc().valueOf();
            }
        } catch (e) {
            console.log(e);
            // do nothing
        }

        this.process = h;
    }

    getStats() {

        let process = this[HANDLE] !== null && this.process !== null;
        let process_external = this[HANDLE] === null && this.process !== null;
        let config = !isEmpty(this.configContent);

        let code = 0;

        if (config) {
            code = 1;
        }

        if (process) {
            code = 2;
        }

        if (process_external) {
            code = 3;
        }

        this.stats = {
            code,
            config,
            process,
            process_external
        };
    }

    getSaves() {
        let S = [];
        if (fs.existsSync(this.savePath)) {
            let saves = fs.readdirSync(this.savePath).filter(o => /\.sav$/.test(o)).map(o => {
                let saveFile = path.join(this.savePath, o);
                let stats = fs.statSync(saveFile);
                return {
                    file   : o,
                    auto   : false,
                    mtimeMs: stats.mtimeMs
                };
            });
            S = S.concat(saves);
        }

        let autoSavePath = path.join(this.savePath, 'autosave');
        if (fs.existsSync(autoSavePath)) {
            let autosaves = fs.readdirSync(autoSavePath).filter(o => /\.sav$/.test(o)).map(o => {
                let saveFile = path.join(autoSavePath, o);
                let stats = fs.statSync(saveFile);
                return {
                    file   : o,
                    auto   : true,
                    mtimeMs: stats.mtimeMs
                };
            });
            S = S.concat(autosaves);
        }
        S = sortBy(S, 'mtimeMs').reverse();

        this.saves = S;
    }

    start(...args) {
        if (this[HANDLE] !== null) {
            return;
        }

        this.spawn(...args);
        this.reflush();
    }

    stopSync() {
        return new Promise((resolve) => {
            this[HANDLE].on('close', (code) => {
                this[HANDLE] = null;
                resolve(code);
            });
            this.send('exit');
        });
    }

    stopSyncForce() {
        return new Promise((resolve) => {
            exec(`kill ${this.process.pid}`, () => {
                setTimeout(function () {
                    resolve();
                }, 5000);
            });
        });
    }

    async stop() {
        if (this[HANDLE]) {
            await this.stopSync();
            this.reflush();
        } else if (this.process) {
            await this.stopSyncForce();
            this.reflush();
        }
    }

    save() {
        if (this[HANDLE] === null) {
            return;
        }
        let ts = moment().format('YYYY_MM_DD_HH_mm_ss');
        let saveFile = path.join(this.savePath, `${this.name}_${ts}`);
        this.send(`save ${saveFile}`);
    }

    spawn(save = null) {
        let withSave = null;
        if (save) {
            withSave = [ '-g', path.join(this.savePath, save.auto ? 'autosave' : '', save.file) ];
        }
        this[HANDLE] = spawn(config.KERNEL, [ '-D', '-x', '-c', this.configFilePath, ...withSave ], {
            detached: true,
            stdio   : 'pipe'
        });

        if (this.options.stdout) {
            this.bindStdout(this[COMMAND_FEEDBACK].dispatcher());
            this.bindStdout(this.options.stdout);
        }

        if (this.options.stderr) {
            this.bindStderr(this.options.stderr);
        }

        this[HANDLE].on('close', this.options.close);
    }

    // exec() {
    //     this[HANDLE] = spawn(config.KERNEL, ['-D', '-x', '-c', this.configFilePath], {
    //         stdio: 'pipe'
    //     });
    // }

    bindStdout(cb = null) {
        cb !== null && this[HANDLE].stdout.on('data', cb);
    }

    bindStderr(cb = null) {
        cb !== null && this[HANDLE].stderr.on('data', cb);
    }

    send(command = null) {
        if (command !== null) {
            this[HANDLE].stdin.write(`${command}\n`);
        }
    }
}