import path from 'path';
import os from 'os';

export const ROOT_PATH = path.resolve(__dirname, '../');
export const PUBLIC_PATH = path.join(ROOT_PATH, 'wwwroot');
export const KERNEL_PATH = path.join(ROOT_PATH, 'kernel');
export const SERVER_PATH = path.join(ROOT_PATH, 'servers');
export const SCRIPT_PATH = path.join(ROOT_PATH, 'scripts');

export const KERNEL = path.join(KERNEL_PATH, (() => {
    if (os.platform() === 'win32') {
        return 'openttd.exe';
    }
    return 'openttd';
})());

export default {
    ROOT_PATH,
    KERNEL_PATH,
    SERVER_PATH,
    PUBLIC_PATH,
    SCRIPT_PATH,
    KERNEL
};