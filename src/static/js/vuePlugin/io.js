import io from '../Model/io';

export default {
    install(Vue) {
        Object.defineProperty(Vue, 'io', {
            get: function () {
                return io;
            }
        });
        Object.defineProperty(Vue.prototype, '$io', Object.getOwnPropertyDescriptor(Vue, 'io'));
    }
};